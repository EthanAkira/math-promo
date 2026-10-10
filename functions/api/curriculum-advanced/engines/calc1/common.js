// Shared helpers for the server-only Calculus I applied-problem engines (types jc1-*).
// Everything here is exact rational arithmetic so answers are never floating-point approximations.
export const ri = (random, min, max) => Math.floor(random() * (max - min + 1)) + min;
export const pick = (random, values) => values[ri(random, 0, values.length - 1)];
export const tx = (profile, ko, en) => (((typeof profile === 'string' ? profile : profile?.locale) || 'ko') === 'ko' ? ko : (en || ko));

export function shuffle(random, items) {
  const out = items.slice();
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

export function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y) [x, y] = [y, x % y];
  return x || 1;
}

// ---- rationals ----------------------------------------------------------------------------
export const Fr = (n, d = 1) => {
  let num = n;
  let den = d;
  if (den < 0) { num = -num; den = -den; }
  const g = gcd(num, den);
  return { n: num / g, d: den / g };
};
export const fadd = (a, b) => Fr(a.n * b.d + b.n * a.d, a.d * b.d);
export const fsub = (a, b) => Fr(a.n * b.d - b.n * a.d, a.d * b.d);
export const fmul = (a, b) => Fr(a.n * b.n, a.d * b.d);
export const fdiv = (a, b) => Fr(a.n * b.d, a.d * b.n);
export const fneg = (a) => Fr(-a.n, a.d);
export const fnum = (a) => a.n / a.d;
export const fabs = (a) => Fr(Math.abs(a.n), a.d);
export const fcmp = (a, b) => Math.sign(a.n * b.d - b.n * a.d);
export const fint = (a) => a.d === 1;
export const F = (x) => (typeof x === 'number' ? Fr(x) : x);

export function ftex(f) {
  if (f.d === 1) return String(f.n);
  return `${f.n < 0 ? '-' : ''}\\frac{${Math.abs(f.n)}}{${f.d}}`;
}

// ---- polynomials (coefficients high -> low, entries are rationals) -------------------------
export const P = (...c) => c.map(F);
export function pTrim(p) {
  let i = 0;
  while (i < p.length - 1 && p[i].n === 0) i += 1;
  return p.slice(i);
}
export function pAdd(a, b) {
  const len = Math.max(a.length, b.length);
  const out = [];
  for (let i = 0; i < len; i += 1) {
    const x = a[a.length - len + i] || Fr(0);
    const y = b[b.length - len + i] || Fr(0);
    out.push(fadd(x, y));
  }
  return pTrim(out);
}
export function pScale(a, k) { return a.map((c) => fmul(c, F(k))); }
export function pMul(a, b) {
  const out = Array.from({ length: a.length + b.length - 1 }, () => Fr(0));
  a.forEach((x, i) => b.forEach((y, j) => { out[i + j] = fadd(out[i + j], fmul(x, y)); }));
  return pTrim(out);
}
export function pEval(p, x) { return p.reduce((acc, c) => fadd(fmul(acc, F(x)), c), Fr(0)); }
export function pDer(p) {
  const deg = p.length - 1;
  if (deg === 0) return [Fr(0)];
  return pTrim(p.slice(0, -1).map((c, i) => fmul(c, Fr(deg - i))));
}
export function pInt(p) {
  const deg = p.length - 1;
  return [...p.map((c, i) => fdiv(c, Fr(deg - i + 1))), Fr(0)];
}
export const pFromRoots = (roots, lead = 1) => roots.reduce((acc, r) => pMul(acc, [Fr(1), Fr(-r)]), [F(lead)]);
export function defInt(p, a, b) {
  const anti = pInt(p);
  return fsub(pEval(anti, b), pEval(anti, a));
}
// Integral of |p| over [a, b] where p's sign changes only at the supplied rational breakpoints.
export function absInt(p, a, b, breaks) {
  const pts = [a, ...breaks.filter((r) => fcmp(F(r), F(a)) > 0 && fcmp(F(r), F(b)) < 0).map(F), b].map(F);
  pts.sort(fcmp);
  let total = Fr(0);
  for (let i = 0; i < pts.length - 1; i += 1) total = fadd(total, fabs(defInt(p, pts[i], pts[i + 1])));
  return total;
}

function term(coef, power, first) {
  const c = coef.n;
  if (c === 0) return '';
  const mag = Math.abs(c);
  let body;
  const coefTxt = coef.d === 1 ? String(mag) : `\\frac{${mag}}{${coef.d}}`;
  const showCoef = !(coef.d === 1 && mag === 1 && power > 0);
  if (power === 0) body = coefTxt;
  else {
    const xs = power === 1 ? 'x' : `x^{${power}}`;
    body = (showCoef ? coefTxt : '') + xs;
  }
  if (first) return (c < 0 ? '-' : '') + body;
  return `${c < 0 ? ' - ' : ' + '}${body}`;
}
export function polyTex(p) {
  const deg = p.length - 1;
  const out = p.map((c, i) => term(c, deg - i, false)).join('').trim();
  if (!out) return '0';
  const clean = out.replace(/^\+ /, '');
  return clean.startsWith('- ') ? `-${clean.slice(2)}` : clean;
}

export const sgn = (n) => (n < 0 ? `- ${-n}` : `+ ${n}`);

// ---- numeric helpers used only by the verification harness --------------------------------
export const numeric = {
  deriv: (f, x, h = 1e-5) => (f(x + h) - f(x - h)) / (2 * h),
  integral: (f, a, b, n = 20000) => {
    const h = (b - a) / n;
    let s = f(a) + f(b);
    for (let i = 1; i < n; i += 1) s += f(a + i * h) * (i % 2 ? 4 : 2);
    return (s * h) / 3;
  },
  limitAt: (f, a, side = 0, h = 1e-6) => (side === 0 ? (f(a - h) + f(a + h)) / 2 : f(a + side * h)),
};

// ---- multiple choice / short answer packaging ---------------------------------------------
function distractorsFor(random, val, positive = false) {
  const cand = [];
  const push = (f) => cand.push(f);
  push(fadd(val, Fr(1)));
  push(fsub(val, Fr(1)));
  push(fneg(val));
  push(fmul(val, Fr(2)));
  push(fdiv(val, Fr(2)));
  push(fadd(val, Fr(2)));
  push(fsub(val, Fr(2)));
  push(fadd(val, Fr(3)));
  push(fsub(val, Fr(3)));
  if (val.d !== 1) { push(Fr(val.n, 1)); push(Fr(val.d, 1)); push(Fr(val.n + 1, val.d)); push(Fr(val.n - 1, val.d)); }
  const seen = new Set([`${val.n}/${val.d}`]);
  const uniq = [];
  // An integer answer keeps integer distractors (a stray 1/5 beside integers reads as a trick option).
  let pool = fint(val) ? cand.filter(fint) : cand;
  if (positive) pool = pool.filter((f) => f.n >= 0);
  shuffle(random, pool).forEach((f) => {
    const key = `${f.n}/${f.d}`;
    if (!seen.has(key)) { seen.add(key); uniq.push(f); }
  });
  let bump = 4;
  while (uniq.length < 4) {
    const f = fadd(val, Fr(bump));
    const key = `${f.n}/${f.d}`;
    if (!seen.has(key)) { seen.add(key); uniq.push(f); }
    bump += 1;
  }
  return uniq.slice(0, 4);
}

// Sort the five options ascending (KICE style) when all are numeric, otherwise keep shuffled order.
export function choicesFromFractions(random, val, positive = false) {
  const all = [val, ...distractorsFor(random, val, positive)].sort(fcmp);
  return { choices: all.map(ftex), answerIndex: all.findIndex((f) => fcmp(f, val) === 0) + 1 };
}
export function choicesFromStrings(random, correct, wrong) {
  const set = [];
  [correct, ...wrong].forEach((s) => { if (!set.includes(s)) set.push(s); });
  const mixed = shuffle(random, set.slice(0, 5));
  return { choices: mixed, answerIndex: mixed.indexOf(correct) + 1 };
}

// Final packaging. `answer` is a rational (Fr) or { str, num, wrong:[...] } for symbolic answers.
const POSITIVE_TAGS = new Set(['jc1-area', 'jc1-motion-dist']);
export function finish(random, { prompt, explanation, answer, tag, verify, allowShort = true, positive }) {
  const pos = positive ?? POSITIVE_TAGS.has(tag);
  const symbolic = answer && answer.str !== undefined;
  let kind = 'mcq';
  let out;
  if (!symbolic && allowShort && fint(answer) && answer.n >= 0 && answer.n <= 999 && random() < 0.3) {
    kind = 'short';
    out = { kind, prompt, answer: String(answer.n), explanation, tag };
  } else if (symbolic) {
    const { choices, answerIndex } = choicesFromStrings(random, answer.str, answer.wrong);
    out = { kind, prompt, choices, answer: String(answerIndex), explanation, tag };
  } else {
    const { choices, answerIndex } = choicesFromFractions(random, answer, pos && answer.n > 0);
    out = { kind, prompt, choices, answer: String(answerIndex), explanation, tag };
  }
  // Non-enumerable so it never reaches the JSON response; used only by the verification harness.
  Object.defineProperty(out, '_check', { enumerable: false, value: { expected: symbolic ? answer.num : fnum(answer), verify } });
  return out;
}
