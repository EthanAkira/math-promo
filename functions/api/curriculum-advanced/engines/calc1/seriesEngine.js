// Calculus I applied problems, types 01-05: limits of sequences, geometric sequences, series,
// graph-based sequence limits, and geometric-series applications (고3 미적분 수열의 극한 단원).
// Every generator builds the problem backward from a chosen integer/rational answer and ships a
// `verify` closure (numeric, independent of the closed form) that the stress test calls.
import { ri, pick, tx, Fr, fadd, fsub, fmul, fdiv, fnum, ftex, finish } from './common.js';

const near = (got, want, tol = 1e-4) => {
  if (!(Math.abs(got - want) <= tol * Math.max(1, Math.abs(want)))) throw new Error(`numeric mismatch: got ${got}, want ${want}`);
  return want;
};

const harmonic = (k) => { let s = Fr(0); for (let i = 1; i <= k; i += 1) s = fadd(s, Fr(1, i)); return s; };

// ---------------------------------------------------------------------------------------------
// 01 수열의 극한
// ---------------------------------------------------------------------------------------------
function conjugateFindConstant(random, profile) {
  const k = pick(random, [1, 2, 3]);
  const L = ri(random, 1, 5);
  const a = 2 * k * L;
  const T = (ko, en) => tx(profile, ko, en);
  const sq = k * k === 1 ? '' : String(k * k);
  return finish(random, {
    tag: 'jc1-seq-limit',
    prompt: T(`양수 $a$에 대하여 $\\lim_{n\\to\\infty}\\left(\\sqrt{${sq}n^2+an}-${k === 1 ? '' : k}n\\right)=${L}$ 일 때, $a$의 값을 구하시오.`,
      `For a positive constant $a$, $\\lim_{n\\to\\infty}\\left(\\sqrt{${sq}n^2+an}-${k === 1 ? '' : k}n\\right)=${L}$. Find $a$.`),
    answer: Fr(a),
    explanation: T(`분자를 유리화하면 $\\sqrt{${sq}n^2+an}-${k === 1 ? '' : k}n=\\frac{an}{\\sqrt{${sq}n^2+an}+${k === 1 ? '' : k}n}$ 이다.\n분모·분자를 $n$으로 나누면 $\\lim_{n\\to\\infty}\\frac{a}{\\sqrt{${sq}+\\frac{a}{n}}+${k}}=\\frac{a}{${2 * k}}$\n$\\frac{a}{${2 * k}}=${L}$ 이므로 $a=${a}$`,
      `Rationalize: the expression equals $\\frac{an}{\\sqrt{${sq}n^2+an}+${k === 1 ? '' : k}n}$; dividing by $n$ the limit is $\\frac{a}{${2 * k}}=${L}$, so $a=${a}$.`),
    verify: () => { const n = 1e6; const f = Math.sqrt(k * k * n * n + a * n) - k * n; near(f, L); return a; },
  });
}

function conjugateDifference(random, profile) {
  const k = pick(random, [1, 2, 3]);
  const b = ri(random, 2, 9);
  let d = ri(random, -3, 8);
  if (d === b) d -= 1;
  const c = ri(random, 1, 9);
  const e = ri(random, 1, 9);
  const T = (ko, en) => tx(profile, ko, en);
  const sq = k * k === 1 ? '' : String(k * k);
  const lin = (v) => (v === 0 ? '' : `${v > 0 ? '+' : '-'}${Math.abs(v) === 1 ? '' : Math.abs(v)}n`);
  const expr = `\\sqrt{${sq}n^2${lin(b)}+${c}}-\\sqrt{${sq}n^2${lin(d)}+${e}}`;
  return finish(random, {
    tag: 'jc1-seq-limit',
    prompt: T(`$\\lim_{n\\to\\infty}\\left(${expr}\\right)$ 의 값을 구하시오.`, `Evaluate $\\lim_{n\\to\\infty}\\left(${expr}\\right)$.`),
    answer: Fr(b - d, 2 * k),
    explanation: T(`두 근호의 차이므로 분자를 유리화한다. 분자는 $(${sq}n^2${lin(b)}+${c})-(${sq}n^2${lin(d)}+${e})=${b - d}n+${c - e}$ 이고 분모는 $\\sqrt{${sq}n^2${lin(b)}+${c}}+\\sqrt{${sq}n^2${lin(d)}+${e}}$.\n분모·분자를 $n$으로 나누면 극한값은 $\\frac{${b - d}}{${k}+${k}}=${ftex(Fr(b - d, 2 * k))}$`,
      `Rationalize the difference of radicals: numerator $${b - d}n+${c - e}$, denominator $\\approx ${2 * k}n$, so the limit is $${ftex(Fr(b - d, 2 * k))}$.`),
    verify: () => { const n = 1e6; return near(Math.sqrt(k * k * n * n + b * n + c) - Math.sqrt(k * k * n * n + d * n + e), (b - d) / (2 * k), 1e-4); },
  });
}

function sequenceDegreeBalance(random, profile) {
  const c = ri(random, 2, 4);
  const L = ri(random, 1, 6);
  const a = c;
  const b = c + L;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-seq-limit',
    prompt: T(`두 상수 $a, b$에 대하여 $\\lim_{n\\to\\infty}\\left(\\frac{an^2+bn+1}{n+1}-${c}n\\right)=${L}$ 일 때, $a+b$의 값을 구하시오.`,
      `For constants $a,b$ with $\\lim_{n\\to\\infty}\\left(\\frac{an^2+bn+1}{n+1}-${c}n\\right)=${L}$, find $a+b$.`),
    answer: Fr(a + b),
    explanation: T(`통분하면 $\\frac{(a-${c})n^2+(b-${c})n+1}{n+1}$. 극한이 수렴하려면 분자의 최고차항 $n^2$의 계수가 $0$이어야 하므로 $a=${c}$.\n그러면 극한값은 $\\frac{b-${c}}{1}=${L}$ 이므로 $b=${b}$.\n따라서 $a+b=${a + b}$`,
      `Combine: numerator $(a-${c})n^2+(b-${c})n+1$. Convergence forces $a=${c}$, then the limit is $b-${c}=${L}$, so $b=${b}$ and $a+b=${a + b}$.`),
    verify: () => { const n = 1e6; near((a * n * n + b * n + 1) / (n + 1) - c * n, L, 1e-3); return a + b; },
  });
}

function squeezeQuotient(random, profile) {
  const p = ri(random, 1, 5);
  const k = ri(random, 1, 4);
  const q = ri(random, -3, 3);
  const r = q + ri(random, 0, 4);
  const s = ri(random, 1, 5);
  const m = ri(random, 1, 6);
  const T = (ko, en) => tx(profile, ko, en);
  const lin = (v) => (v === 0 ? '' : `${v > 0 ? '+' : '-'}${Math.abs(v) === 1 ? '' : Math.abs(v)}n`);
  return finish(random, {
    tag: 'jc1-seq-limit',
    prompt: T(`수열 $\\{a_n\\}$이 모든 자연수 $n$에 대하여 $${p === 1 ? '' : p}n^2${lin(q)}<a_n<${p === 1 ? '' : p}n^2${lin(r)}+${s}$ 를 만족시킬 때, $\\lim_{n\\to\\infty}\\frac{a_n}{${k === 1 ? '' : k}n^2+${m}}$ 의 값을 구하시오.`,
      `A sequence satisfies $${p === 1 ? '' : p}n^2${lin(q)}<a_n<${p === 1 ? '' : p}n^2${lin(r)}+${s}$ for every positive integer $n$. Find $\\lim_{n\\to\\infty}\\frac{a_n}{${k === 1 ? '' : k}n^2+${m}}$.`),
    answer: Fr(p, k),
    explanation: T(`부등식의 각 변을 $${k === 1 ? '' : k}n^2+${m}$ (>0)으로 나누면 양 끝의 극한이 모두 $\\frac{${p}}{${k}}$ 이다.\n사이에 낀 수열의 극한(샌드위치 정리)에 의해 $\\lim_{n\\to\\infty}\\frac{a_n}{${k === 1 ? '' : k}n^2+${m}}=${ftex(Fr(p, k))}$`,
      `Divide the inequality by $${k === 1 ? '' : k}n^2+${m}$; both bounds tend to $${ftex(Fr(p, k))}$, so by the squeeze theorem so does the quotient.`),
    verify: () => { const n = 1e6; const an = p * n * n + ((q + r) / 2) * n + s / 2; return near(an / (k * n * n + m), p / k, 1e-4); },
  });
}

function ratioSubstitution(random, profile) {
  const L = ri(random, 1, 5);
  const p = ri(random, 1, 6);
  const q = ri(random, 1, 6);
  const r = ri(random, 1, 4);
  const s = ri(random, 1, 5);
  const T = (ko, en) => tx(profile, ko, en);
  const co = (v) => (v === 1 ? '' : String(v));
  return finish(random, {
    tag: 'jc1-seq-limit',
    prompt: T(`수열 $\\{a_n\\}$에 대하여 $\\lim_{n\\to\\infty}\\frac{a_n}{n}=${L}$ 일 때, $\\lim_{n\\to\\infty}\\frac{${co(p)}a_n+${co(q)}n}{${co(r)}a_n+${co(s)}n}$ 의 값을 구하시오.`,
      `If $\\lim_{n\\to\\infty}\\frac{a_n}{n}=${L}$, evaluate $\\lim_{n\\to\\infty}\\frac{${co(p)}a_n+${co(q)}n}{${co(r)}a_n+${co(s)}n}$.`),
    answer: Fr(p * L + q, r * L + s),
    explanation: T(`분모·분자를 $n$으로 나누면 $\\frac{${co(p)}\\cdot\\frac{a_n}{n}+${q}}{${co(r)}\\cdot\\frac{a_n}{n}+${s}}$ 이고 $\\frac{a_n}{n}\\to ${L}$ 이므로\n극한값은 $\\frac{${p * L}+${q}}{${r * L}+${s}}=${ftex(Fr(p * L + q, r * L + s))}$`,
      `Divide top and bottom by $n$ and substitute $a_n/n\\to ${L}$: the limit is $${ftex(Fr(p * L + q, r * L + s))}$.`),
    verify: () => { const n = 1e6; const an = L * n; return near((p * an + q * n) / (r * an + s * n), (p * L + q) / (r * L + s)); },
  });
}

function squaresSumLimit(random, profile) {
  const a = ri(random, 1, 6);
  const b = ri(random, 1, 5);
  const c = ri(random, 1, 4);
  const d = ri(random, 1, 5);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-seq-limit',
    prompt: T(`$\\lim_{n\\to\\infty}\\frac{1}{${c === 1 ? '' : c}n^3+${d}n}\\sum_{k=1}^{n}\\left(${a === 1 ? '' : a}k^2+${b === 1 ? '' : b}k\\right)$ 의 값을 구하시오.`,
      `Evaluate $\\lim_{n\\to\\infty}\\frac{1}{${c === 1 ? '' : c}n^3+${d}n}\\sum_{k=1}^{n}\\left(${a === 1 ? '' : a}k^2+${b === 1 ? '' : b}k\\right)$.`),
    answer: Fr(a, 3 * c),
    explanation: T(`$\\sum_{k=1}^{n}k^2=\\frac{n(n+1)(2n+1)}{6}$, $\\sum_{k=1}^{n}k=\\frac{n(n+1)}{2}$ 이므로 합의 최고차항은 $\\frac{${a}}{3}n^3$ 이다.\n분모의 최고차항 $${c}n^3$으로 비교하면 극한값은 $\\frac{${a}/3}{${c}}=${ftex(Fr(a, 3 * c))}$`,
      `The sum has leading term $\\frac{${a}}{3}n^3$, the denominator $${c}n^3$, so the limit is $${ftex(Fr(a, 3 * c))}$.`),
    verify: () => { const n = 1e5; const s2 = (n * (n + 1) * (2 * n + 1)) / 6; const s1 = (n * (n + 1)) / 2; return near((a * s2 + b * s1) / (c * n ** 3 + d * n), a / (3 * c), 1e-3); },
  });
}

// ---------------------------------------------------------------------------------------------
// 02 등비수열의 극한
// ---------------------------------------------------------------------------------------------
function geoRatioValue(random, profile) {
  const r = pick(random, [2, 3, 4, 5]);
  const a = ri(random, 1, 5);
  const c = ri(random, 1, 4);
  const b = ri(random, -9, 9);
  const d = ri(random, -9, 9) || 3;
  const T = (ko, en) => tx(profile, ko, en);
  const co = (v) => (v === 1 ? '' : String(v));
  const sg = (v) => (v < 0 ? `-${-v}` : `+${v}`);
  return finish(random, {
    tag: 'jc1-geo-limit',
    prompt: T(`$\\lim_{n\\to\\infty}\\frac{${co(a)}\\cdot ${r}^{n+1}${sg(b)}}{${co(c)}\\cdot ${r}^{n}${sg(d)}}$ 의 값을 구하시오.`, `Evaluate $\\lim_{n\\to\\infty}\\frac{${co(a)}\\cdot ${r}^{n+1}${sg(b)}}{${co(c)}\\cdot ${r}^{n}${sg(d)}}$.`),
    answer: Fr(a * r, c),
    explanation: T(`분모·분자를 $${r}^n$으로 나누면 $\\frac{${a * r}+${b}\\cdot ${r}^{-n}}{${c}+${d}\\cdot ${r}^{-n}}$ 이고 $${r}^{-n}\\to 0$ 이므로 극한값은 $\\frac{${a * r}}{${c}}=${ftex(Fr(a * r, c))}$`,
      `Divide by $${r}^n$; since $${r}^{-n}\\to0$ the limit is $\\frac{${a * r}}{${c}}=${ftex(Fr(a * r, c))}$.`),
    verify: () => { const n = 30; return near((a * r ** (n + 1) + b) / (c * r ** n + d), (a * r) / c, 1e-6); },
  });
}

function geoTwoBases(random, profile) {
  const p = ri(random, 3, 6);
  const q = ri(random, 1, p - 1);
  const a = ri(random, 1, 4);
  const bb = ri(random, 1, 4);
  const T = (ko, en) => tx(profile, ko, en);
  const co = (v) => (v === 1 ? '' : String(v));
  return finish(random, {
    tag: 'jc1-geo-limit',
    prompt: T(`$\\lim_{n\\to\\infty}\\frac{${co(a)}\\cdot ${p}^{n+1}+${co(bb)}\\cdot ${q}^{n+1}}{${p}^{n}+${q}^{n}}$ 의 값을 구하시오.`, `Evaluate $\\lim_{n\\to\\infty}\\frac{${co(a)}\\cdot ${p}^{n+1}+${co(bb)}\\cdot ${q}^{n+1}}{${p}^{n}+${q}^{n}}$.`),
    answer: Fr(a * p),
    explanation: T(`밑이 가장 큰 $${p}^n$으로 분모·분자를 나눈다. $\\left(\\frac{${q}}{${p}}\\right)^n\\to0$ 이므로 극한값은 $\\frac{${a * p}+0}{1+0}=${a * p}$`,
      `Divide by $${p}^n$; $(${q}/${p})^n\\to0$, so the limit is $${a * p}$.`),
    verify: () => { const n = 600; const r = (q / p) ** n; return near((a * p + bb * q * r) / (1 + r), a * p, 1e-6); },
  });
}

function geoFindConstant(random, profile) {
  const r = pick(random, [2, 3, 4, 5]);
  const a = ri(random, 1, 6);
  const c = pick(random, [1, 2, 3]);
  const L = Fr(a * r, c);
  const T = (ko, en) => tx(profile, ko, en);
  const co = (v) => (v === 1 ? '' : String(v));
  return finish(random, {
    tag: 'jc1-geo-limit',
    prompt: T(`상수 $a$에 대하여 $\\lim_{n\\to\\infty}\\frac{a\\cdot ${r}^{n+1}+3}{${co(c)}\\cdot ${r}^{n}-1}=${ftex(L)}$ 일 때, $a$의 값을 구하시오.`, `Given $\\lim_{n\\to\\infty}\\frac{a\\cdot ${r}^{n+1}+3}{${co(c)}\\cdot ${r}^{n}-1}=${ftex(L)}$, find $a$.`),
    answer: Fr(a),
    explanation: T(`분모·분자를 $${r}^n$으로 나누면 극한값은 $\\frac{${r}a}{${c}}$ 이다. $\\frac{${r}a}{${c}}=${ftex(L)}$ 이므로 $a=${a}$`,
      `After dividing by $${r}^n$ the limit is $\\frac{${r}a}{${c}}=${ftex(L)}$, hence $a=${a}$.`),
    verify: () => { const n = 30; near((a * r ** (n + 1) + 3) / (c * r ** n - 1), fnum(L), 1e-6); return a; },
  });
}

function partialSumRatio(random, profile) {
  const p = ri(random, 2, 6);
  const A = ri(random, 2, 6);
  const B = ri(random, -5, 5);
  const T = (ko, en) => tx(profile, ko, en);
  const want = Fr(p - 1, p);
  return finish(random, {
    tag: 'jc1-geo-limit',
    prompt: T(`수열 $\\{a_n\\}$의 첫째항부터 제$n$항까지의 합 $S_n$이 $S_n=${A}\\cdot ${p}^{n}${B < 0 ? B : `+${B}`}$ 일 때, $\\lim_{n\\to\\infty}\\frac{a_n}{S_n}$ 의 값을 구하시오.`,
      `The sum of the first $n$ terms is $S_n=${A}\\cdot ${p}^{n}${B < 0 ? B : `+${B}`}$. Find $\\lim_{n\\to\\infty}\\frac{a_n}{S_n}$.`),
    answer: want,
    explanation: T(`$n\\ge2$ 일 때 $a_n=S_n-S_{n-1}=${A}\\cdot ${p}^{n}-${A}\\cdot ${p}^{n-1}=${A * (p - 1)}\\cdot ${p}^{n-1}$ 이다.\n$\\frac{a_n}{S_n}=\\frac{${A * (p - 1)}\\cdot ${p}^{n-1}}{${A}\\cdot ${p}^{n}${B < 0 ? B : `+${B}`}}$ 의 분모·분자를 $${p}^{n}$으로 나누면 극한값은 $\\frac{${A * (p - 1)}/${p}}{${A}}=${ftex(want)}$`,
      `For $n\\ge2$, $a_n=S_n-S_{n-1}=${A * (p - 1)}\\cdot ${p}^{n-1}$; dividing by $${p}^n$ gives limit $${ftex(want)}$.`),
    verify: () => { const n = 40; const S = (m) => A * p ** m + B; return near((S(n) - S(n - 1)) / S(n), fnum(want), 1e-6); },
  });
}

function geoPiecewiseSum(random, profile) {
  const a = pick(random, [-3, -1, 1, 3, 5, 7]);
  const T = (ko, en) => tx(profile, ko, en);
  const ans = Fr(3 * a + 5, 2);
  return finish(random, {
    tag: 'jc1-geo-limit',
    prompt: T(`양수 $x$에 대하여 $f(x)=\\lim_{n\\to\\infty}\\frac{x^{n+1}${a < 0 ? a : `+${a}`}}{x^{n}+1}$ 일 때, $f\\left(\\frac{1}{2}\\right)+f(1)+f(2)$ 의 값을 구하시오.`,
      `For $x>0$ let $f(x)=\\lim_{n\\to\\infty}\\frac{x^{n+1}${a < 0 ? a : `+${a}`}}{x^{n}+1}$. Find $f\\left(\\frac{1}{2}\\right)+f(1)+f(2)$.`),
    answer: ans,
    explanation: T(`$0<x<1$ 이면 $x^n\\to0$ 이므로 $f(x)=${a}$ → $f\\left(\\frac12\\right)=${a}$.\n$x=1$ 이면 $f(1)=\\frac{1+${a}}{2}=${ftex(Fr(1 + a, 2))}$.\n$x>1$ 이면 분모·분자를 $x^n$으로 나누어 $f(x)=x$ → $f(2)=2$.\n따라서 합은 $${a}+${ftex(Fr(1 + a, 2))}+2=${ftex(ans)}$`,
      `For $0<x<1$, $f=${a}$; $f(1)=\\frac{1+${a}}{2}$; for $x>1$, $f(x)=x$. Sum $=${ftex(ans)}$.`),
    verify: () => { const f = (x) => { const n = 400; return (x ** (n + 1) + a) / (x ** n + 1); }; return near(f(0.5) + f(1) + f(2), fnum(ans), 1e-6); },
  });
}

// ---------------------------------------------------------------------------------------------
// 03 급수
// ---------------------------------------------------------------------------------------------
function seriesTermLimit(random, profile) {
  const p = pick(random, [1, 2, 3]);
  const q = ri(random, 1, 9);
  const r = ri(random, 1, 4);
  const s = ri(random, 1, 6);
  const u = ri(random, 1, 5);
  const L = Fr(q, p);
  const T = (ko, en) => tx(profile, ko, en);
  const co = (v) => (v === 1 ? '' : String(v));
  const ans = fdiv(fadd(fmul(Fr(r), L), Fr(s)), fadd(L, Fr(u)));
  return finish(random, {
    tag: 'jc1-series',
    prompt: T(`수열 $\\{a_n\\}$에 대하여 급수 $\\sum_{n=1}^{\\infty}\\left(${co(p)}a_n-${q}\\right)$ 가 수렴할 때, $\\lim_{n\\to\\infty}\\frac{${co(r)}a_n+${s}}{a_n+${u}}$ 의 값을 구하시오.`,
      `The series $\\sum_{n=1}^{\\infty}\\left(${co(p)}a_n-${q}\\right)$ converges. Find $\\lim_{n\\to\\infty}\\frac{${co(r)}a_n+${s}}{a_n+${u}}$.`),
    answer: ans,
    explanation: T(`급수 $\\sum(${co(p)}a_n-${q})$ 가 수렴하므로 $\\lim_{n\\to\\infty}(${co(p)}a_n-${q})=0$, 즉 $\\lim_{n\\to\\infty}a_n=${ftex(L)}$.\n따라서 $\\lim\\frac{${co(r)}a_n+${s}}{a_n+${u}}=\\frac{${co(r)}\\cdot ${ftex(L)}+${s}}{${ftex(L)}+${u}}=${ftex(ans)}$`,
      `Convergence forces $\\lim(${co(p)}a_n-${q})=0$, so $a_n\\to${ftex(L)}$; substituting gives $${ftex(ans)}$.`),
    verify: () => { const an = fnum(L); return near((r * an + s) / (an + u), fnum(ans)); },
  });
}

function telescopingKnown(random, profile) {
  const m = ri(random, 1, 6);
  const k = ri(random, 2, 4);
  const ans = fmul(Fr(m, k), harmonic(k));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-series',
    prompt: T(`$\\sum_{n=1}^{\\infty}\\frac{${m}}{n(n+${k})}$ 의 값을 구하시오.`, `Evaluate $\\sum_{n=1}^{\\infty}\\frac{${m}}{n(n+${k})}$.`),
    answer: ans,
    explanation: T(`부분분수로 $\\frac{${m}}{n(n+${k})}=\\frac{${ftex(Fr(m, k))}}{1}\\left(\\frac1n-\\frac1{n+${k}}\\right)$ 이다.\n부분합 $S_N$ 에서 중간 항이 모두 소거되어 처음 ${k}개와 마지막 ${k}개의 항만 남으므로 $N\\to\\infty$ 일 때 $S=${ftex(Fr(m, k))}\\left(${Array.from({ length: k }, (_, i) => `\\frac1${i + 1}`).join('+')}\\right)=${ftex(ans)}$`,
      `Partial fractions telescope, leaving the first ${k} reciprocals: the sum is $${ftex(ans)}$.`),
    verify: () => { let s = 0; for (let n = 1; n <= 400000; n += 1) s += m / (n * (n + k)); return near(s, fnum(ans), 1e-4); },
  });
}

function telescopingShifted(random, profile) {
  const a = ri(random, 2, 4);
  const b = ri(random, 1, 3);
  const m = ri(random, 1, 4);
  const ans = Fr(m, a * (a + b));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-series',
    prompt: T(`$\\sum_{n=1}^{\\infty}\\frac{${m}}{(${a}n+${b})(${a}n+${a + b})}$ 의 값을 구하시오.`, `Evaluate $\\sum_{n=1}^{\\infty}\\frac{${m}}{(${a}n+${b})(${a}n+${a + b})}$.`),
    answer: ans,
    explanation: T(`$\\frac{1}{(${a}n+${b})(${a}n+${a + b})}=\\frac{1}{${a}}\\left(\\frac{1}{${a}n+${b}}-\\frac{1}{${a}n+${a + b}}\\right)$ 로 부분분수 분해하면 연속한 항이 소거되어\n$S=${m}\\cdot\\frac1{${a}}\\cdot\\frac{1}{${a + b}}=${ftex(ans)}$`,
      `Telescoping gives $${m}\\cdot\\frac{1}{${a}}\\cdot\\frac1{${a + b}}=${ftex(ans)}$.`),
    verify: () => { let s = 0; for (let n = 1; n <= 400000; n += 1) s += m / ((a * n + b) * (a * n + a + b)); return near(s, fnum(ans), 1e-4); },
  });
}

function geometricRecurrence(random, profile) {
  const [num, den] = pick(random, [[1, 2], [1, 3], [2, 3], [3, 4], [1, 4], [-1, 2], [-1, 3]]);
  const p = den * ri(random, 1, 4);
  const q = (p * num) / den;
  const ans = fdiv(Fr(p), fsub(Fr(1), Fr(num, den)));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-series',
    prompt: T(`수열 $\\{a_n\\}$이 $a_1=${p}$, $a_2=${q}$ 이고 모든 자연수 $n$에 대하여 $a_{n+1}^2=a_n a_{n+2}$ 를 만족시킬 때, 급수 $\\sum_{n=1}^{\\infty}a_n$ 의 값을 구하시오.`,
      `A sequence has $a_1=${p}$, $a_2=${q}$ and $a_{n+1}^2=a_na_{n+2}$ for all $n$. Find $\\sum_{n=1}^{\\infty}a_n$.`),
    answer: ans,
    explanation: T(`$a_{n+1}^2=a_na_{n+2}$ 이므로 $\\{a_n\\}$은 등비수열이고 공비는 $r=\\frac{a_2}{a_1}=\\frac{${q}}{${p}}=${ftex(Fr(num, den))}$ 이다.\n$|r|<1$ 이므로 $\\sum a_n=\\frac{a_1}{1-r}=\\frac{${p}}{1-${num < 0 ? `(${ftex(Fr(num, den))})` : ftex(Fr(num, den))}}=${ftex(ans)}$`,
      `The sequence is geometric with ratio $${ftex(Fr(num, den))}$, so the sum is $\\frac{${p}}{1-r}=${ftex(ans)}$.`),
    verify: () => { let s = 0; let t = p; const r = num / den; for (let i = 0; i < 400; i += 1) { s += t; t *= r; } return near(s, fnum(ans), 1e-9); },
  });
}

function geometricFindSecond(random, profile) {
  const a1 = pick(random, [2, 3, 4, 6]);
  let S;
  do { S = ri(random, 2, 14); } while (!(a1 / S > 0 && a1 / S < 2) || S === a1);
  const r = fsub(Fr(1), Fr(a1, S));
  const a2 = fmul(Fr(a1), r);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-series',
    prompt: T(`첫째항이 $${a1}$ 인 무한등비급수 $\\sum_{n=1}^{\\infty}a_n$ 이 수렴하고 그 합이 $${S}$ 일 때, 제$2$항 $a_2$ 의 값을 구하시오.`,
      `An infinite geometric series with first term $${a1}$ converges to $${S}$. Find the second term $a_2$.`),
    answer: a2,
    explanation: T(`공비를 $r$ 이라 하면 $\\frac{${a1}}{1-r}=${S}$ 이므로 $1-r=${ftex(Fr(a1, S))}$, 즉 $r=${ftex(r)}$.\n따라서 $a_2=a_1r=${a1}\\cdot ${r.n < 0 ? `(${ftex(r)})` : ftex(r)}=${ftex(a2)}$`,
      `From $\\frac{${a1}}{1-r}=${S}$ we get $r=${ftex(r)}$ and $a_2=${ftex(a2)}$.`),
    verify: () => { let s = 0; let t = a1; for (let i = 0; i < 800; i += 1) { s += t; t *= fnum(r); } near(s, S, 1e-6); return fnum(a2); },
  });
}

function parityWeightedSeries(random, profile) {
  const b = pick(random, [2, 3]);
  const c = ri(random, 1, 8);
  const d = ri(random, 1, 8);
  const ans = b === 2 ? Fr(2 * c + d, 3) : Fr(3 * c + d, 8);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-series',
    prompt: T(`수열 $\\{a_n\\}$이 $a_n=\\begin{cases}${c} & (n\\text{이 홀수})\\\\ ${d} & (n\\text{이 짝수})\\end{cases}$ 일 때, $\\sum_{n=1}^{\\infty}\\frac{a_n}{${b}^{n}}$ 의 값을 구하시오.`,
      `Let $a_n=${c}$ for odd $n$ and $a_n=${d}$ for even $n$. Find $\\sum_{n=1}^{\\infty}\\frac{a_n}{${b}^{n}}$.`),
    answer: ans,
    explanation: T(`홀수 번째 항의 합은 첫째항 $\\frac{${c}}{${b}}$, 공비 $\\frac1{${b * b}}$ 인 등비급수이고, 짝수 번째 항의 합은 첫째항 $\\frac{${d}}{${b * b}}$, 공비 $\\frac{1}{${b * b}}$ 이다.\n$\\frac{${c}/${b}}{1-1/${b * b}}+\\frac{${d}/${b * b}}{1-1/${b * b}}=${ftex(ans)}$`,
      `Split into odd and even terms (ratio $1/${b * b}$ each); the total is $${ftex(ans)}$.`),
    verify: () => { let s = 0; for (let n = 1; n <= 200; n += 1) s += (n % 2 ? c : d) / b ** n; return near(s, fnum(ans), 1e-9); },
  });
}

function convergenceIntegers(random, profile) {
  const a = ri(random, 2, 6);
  const b = ri(random, 2, 5);
  const ans = Fr((2 * b - 1) * a);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-series',
    prompt: T(`무한급수 $\\sum_{n=1}^{\\infty}\\left(\\frac{x-${a}}{${b}}\\right)^{n}$ 이 수렴하도록 하는 모든 정수 $x$의 값의 합을 구하시오.`,
      `Find the sum of all integers $x$ for which $\\sum_{n=1}^{\\infty}\\left(\\frac{x-${a}}{${b}}\\right)^{n}$ converges.`),
    answer: ans,
    explanation: T(`공비가 $\\frac{x-${a}}{${b}}$ 인 등비급수이므로 수렴 조건은 $\\left|\\frac{x-${a}}{${b}}\\right|<1$, 즉 $${a - b}<x<${a + b}$.\n정수 $x$는 $${a - b + 1}, \\cdots, ${a + b - 1}$ 의 $${2 * b - 1}$개이고 합은 $${2 * b - 1}\\times ${a}=${ans.n}$`,
      `Convergence needs $|x-${a}|<${b}$, i.e. $x=${a - b + 1},\\dots,${a + b - 1}$; their sum is $${ans.n}$.`),
    verify: () => { let s = 0; for (let x = a - b - 5; x <= a + b + 5; x += 1) if (Math.abs(x - a) < b) s += x; return s; },
  });
}

// ---------------------------------------------------------------------------------------------
// 04 그래프를 이용한 수열의 극한
// ---------------------------------------------------------------------------------------------
function parabolaChord(random, profile) {
  const a = ri(random, 1, 4);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-graph-limit',
    prompt: T(`자연수 $n$에 대하여 곡선 $y=${a === 1 ? '' : a}x^2$ 위의 두 점 $\\mathrm{P}(n,\\ ${a === 1 ? '' : a}n^2)$, $\\mathrm{Q}(n+1,\\ ${a === 1 ? '' : a}(n+1)^2)$ 사이의 거리를 $l_n$ 이라 할 때, $\\lim_{n\\to\\infty}\\frac{l_n}{n}$ 의 값을 구하시오.`,
      `For the points $P(n,${a === 1 ? '' : a}n^2)$ and $Q(n+1,${a === 1 ? '' : a}(n+1)^2)$ on $y=${a === 1 ? '' : a}x^2$ let $l_n=PQ$. Find $\\lim l_n/n$.`),
    answer: Fr(2 * a),
    explanation: T(`$l_n=\\sqrt{1^2+(${a}(2n+1))^2}=\\sqrt{1+${a * a}(2n+1)^2}$ 이다.\n$\\frac{l_n}{n}=\\sqrt{\\frac{1}{n^2}+${a * a}\\left(2+\\frac1n\\right)^2}\\to\\sqrt{${a * a}\\cdot 4}=${2 * a}$`,
      `$l_n=\\sqrt{1+${a * a}(2n+1)^2}$, so $l_n/n\\to ${2 * a}$.`),
    verify: () => { const n = 1e6; return near(Math.hypot(1, a * (2 * n + 1)) / n, 2 * a, 1e-5); },
  });
}

function radicalChord(random, profile) {
  const k = ri(random, 2, 9);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-graph-limit',
    prompt: T(`자연수 $n$에 대하여 곡선 $y=\\sqrt{${k}x}$ 위의 점 $\\mathrm{P}(n,\\ \\sqrt{${k}n})$ 과 $x$축 위의 점 $\\mathrm{Q}(n,\\ 0)$ 이 있다. 원점 $\\mathrm{O}$에 대하여 $\\lim_{n\\to\\infty}\\left(\\overline{\\mathrm{OP}}-\\overline{\\mathrm{OQ}}\\right)$ 의 값을 구하시오.`,
      `Let $P(n,\\sqrt{${k}n})$ lie on $y=\\sqrt{${k}x}$ and $Q(n,0)$ on the x-axis. Find $\\lim(OP-OQ)$.`),
    answer: Fr(k, 2),
    explanation: T(`$\\overline{\\mathrm{OP}}=\\sqrt{n^2+${k}n}$, $\\overline{\\mathrm{OQ}}=n$ 이므로 $\\sqrt{n^2+${k}n}-n=\\frac{${k}n}{\\sqrt{n^2+${k}n}+n}\\to\\frac{${k}}{2}$`,
      `$OP-OQ=\\sqrt{n^2+${k}n}-n\\to ${k}/2$.`),
    verify: () => { const n = 1e6; return near(Math.sqrt(n * n + k * n) - n, k / 2, 1e-4); },
  });
}

function verticalGap(random, profile) {
  const s = ri(random, 3, 7);
  const t = ri(random, 1, s - 1);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-graph-limit',
    prompt: T(`자연수 $n$에 대하여 직선 $x=n$ 이 두 곡선 $y=\\sqrt{${s * s}x}$, $y=\\sqrt{${t * t}x}$ 와 만나는 점을 각각 $\\mathrm{P}_n$, $\\mathrm{Q}_n$ 이라 하자. $\\overline{\\mathrm{P}_n\\mathrm{Q}_n}=l_n$ 일 때 $\\lim_{n\\to\\infty}\\frac{l_n}{\\sqrt{n}}$ 의 값을 구하시오.`,
      `The line $x=n$ meets $y=\\sqrt{${s * s}x}$ and $y=\\sqrt{${t * t}x}$ at $P_n,Q_n$; with $l_n=P_nQ_n$, find $\\lim l_n/\\sqrt n$.`),
    answer: Fr(s - t),
    explanation: T(`$\\mathrm{P}_n(n,\\sqrt{${s * s}n})=(n,${s}\\sqrt n)$, $\\mathrm{Q}_n(n,${t}\\sqrt n)$ 이므로 $l_n=(${s}-${t})\\sqrt n$ 이고 $\\frac{l_n}{\\sqrt n}=${s - t}$`,
      `$l_n=(${s}-${t})\\sqrt n$, so the ratio is $${s - t}$.`),
    verify: () => { const n = 1e6; return near((Math.sqrt(s * s * n) - Math.sqrt(t * t * n)) / Math.sqrt(n), s - t, 1e-9); },
  });
}

function hyperbolaIntersection(random, profile) {
  const s = ri(random, 1, 5);
  const m = s * s;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-graph-limit',
    prompt: T(`자연수 $n$에 대하여 곡선 $y=\\frac{n}{x}\\ (x>0)$ 과 직선 $y=\\frac{x}{${m}}$ 의 교점의 $y$좌표를 $y_n$ 이라 하고 $l_n=y_{n+1}-y_n$ 이라 할 때, $\\lim_{n\\to\\infty}\\sqrt{n}\\,l_n$ 의 값을 구하시오.`,
      `Let $y_n$ be the y-coordinate of the intersection of $y=n/x\\ (x>0)$ with $y=x/${m}$ and $l_n=y_{n+1}-y_n$. Find $\\lim\\sqrt n\\,l_n$.`),
    answer: Fr(1, 2 * s),
    explanation: T(`$\\frac{n}{x}=\\frac{x}{${m}}$ 에서 $x^2=${m}n$, $x=${s}\\sqrt n$ 이므로 $y_n=\\frac{${s}\\sqrt n}{${m}}=\\frac{\\sqrt n}{${s}}$.\n$l_n=\\frac{\\sqrt{n+1}-\\sqrt n}{${s}}=\\frac{1}{${s}(\\sqrt{n+1}+\\sqrt n)}$ 이므로 $\\sqrt n\\,l_n\\to\\frac{1}{${s}\\cdot 2}=${ftex(Fr(1, 2 * s))}$`,
      `$y_n=\\sqrt n/${s}$, $l_n=\\frac{1}{${s}(\\sqrt{n+1}+\\sqrt n)}$, so $\\sqrt n\\,l_n\\to ${ftex(Fr(1, 2 * s))}$.`),
    verify: () => { const n = 1e6; const y = (j) => Math.sqrt(j) / s; return near(Math.sqrt(n) * (y(n + 1) - y(n)), 1 / (2 * s), 1e-4); },
  });
}

// ---------------------------------------------------------------------------------------------
// 05 등비급수의 활용
// ---------------------------------------------------------------------------------------------
function nestedSquaresTotal(random, profile) {
  const L = ri(random, 2, 9);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-geo-apps',
    prompt: T(`한 변의 길이가 $${L}$ 인 정사각형 $R_1$ 이 있다. $R_1$ 의 각 변의 중점을 이어 만든 정사각형을 $R_2$, $R_2$ 의 각 변의 중점을 이어 만든 정사각형을 $R_3$, … 이와 같은 과정을 한없이 반복할 때, 모든 정사각형 $R_n$ 의 넓이의 합을 구하시오.`,
      `Square $R_1$ has side ${L}. Joining the midpoints of its sides gives $R_2$, then $R_3$, and so on forever. Find the total area of all $R_n$.`),
    answer: Fr(2 * L * L),
    explanation: T(`중점을 이으면 정사각형의 넓이는 이전의 $\\frac12$ 배가 된다. 첫째항 $${L * L}$, 공비 $\\frac12$ 인 등비급수이므로 합은 $\\frac{${L * L}}{1-\\frac12}=${2 * L * L}$`,
      `Each square has half the previous area: $\\frac{${L * L}}{1-1/2}=${2 * L * L}$.`),
    verify: () => { let s = 0; let t = L * L; for (let i = 0; i < 200; i += 1) { s += t; t /= 2; } return near(s, 2 * L * L, 1e-9); },
  });
}

function nestedSquaresSide(random, profile) {
  const L = ri(random, 2, 9);
  const S = 2 * L * L;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-geo-apps',
    prompt: T(`정사각형 $R_1$ 의 각 변의 중점을 이어 정사각형 $R_2$ 를 만들고, $R_2$ 의 각 변의 중점을 이어 $R_3$ 을 만드는 과정을 한없이 반복한다. 모든 $R_n$ 의 넓이의 합이 $${S}$ 일 때, $R_1$ 의 한 변의 길이를 구하시오.`,
      `Nested midpoint squares $R_1,R_2,\\dots$ have total area ${S}. Find the side length of $R_1$.`),
    answer: Fr(L),
    explanation: T(`$R_1$ 의 한 변의 길이를 $x$ 라 하면 넓이의 합은 $\\frac{x^2}{1-\\frac12}=2x^2=${S}$ 이므로 $x^2=${L * L}$, $x=${L}$`,
      `Total area $=2x^2=${S}$, so $x=${L}$.`),
    verify: () => { const x = L; let s = 0; let t = x * x; for (let i = 0; i < 200; i += 1) { s += t; t /= 2; } near(s, S, 1e-9); return L; },
  });
}

function bouncingBall(random, profile) {
  const [num, den] = pick(random, [[1, 2], [1, 3], [2, 3], [3, 4], [3, 5]]);
  const h = den * ri(random, 1, 4);
  const r = Fr(num, den);
  const total = fmul(Fr(h), fdiv(fadd(Fr(1), r), fsub(Fr(1), r)));
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-geo-apps',
    prompt: T(`높이 $${h}\\,\\mathrm{m}$ 에서 공을 떨어뜨린다. 공은 지면에 닿을 때마다 직전에 떨어진 높이의 $${ftex(r)}$ 배만큼 다시 튀어 오른다. 이와 같이 한없이 튀어 오를 때, 공이 움직인 거리의 총합(m)을 구하시오.`,
      `A ball is dropped from ${h} m and each time rebounds to ${ftex(r)} of its previous drop height, forever. Find the total distance traveled (m).`),
    answer: total,
    explanation: T(`내려오는 거리의 합은 $\\frac{${h}}{1-${ftex(r)}}=${ftex(fdiv(Fr(h), fsub(Fr(1), r)))}$, 올라가는 거리의 합은 $\\frac{${h}\\cdot ${ftex(r)}}{1-${ftex(r)}}=${ftex(fdiv(fmul(Fr(h), r), fsub(Fr(1), r)))}$ 이다.\n따라서 총 거리는 $${ftex(total)}$`,
      `Down: $\\frac{${h}}{1-r}$, up: $\\frac{${h}r}{1-r}$; total $${ftex(total)}$.`),
    verify: () => { let s = h; let up = h * fnum(r); for (let i = 0; i < 400; i += 1) { s += 2 * up; up *= fnum(r); } return near(s, fnum(total), 1e-9); },
  });
}

function circleSquareRing(random, profile) {
  const r = ri(random, 1, 6);
  const a = 2 * r * r;
  const b = 4 * r * r;
  const T = (ko, en) => tx(profile, ko, en);
  const str = `${a}\\pi-${b}`;
  return finish(random, {
    tag: 'jc1-geo-apps',
    answer: { str, num: a * Math.PI - b, wrong: [`${a}\\pi-${b / 2}`, `${a / 2}\\pi-${b}`, `${a}\\pi-${2 * b}`, `${2 * a}\\pi-${b}`] },
    prompt: T(`반지름의 길이가 $${r}$ 인 원 $C_1$ 에 내접하는 정사각형을 그리고, 이 정사각형에 내접하는 원을 $C_2$ 라 하자. 이 과정을 한없이 반복한다. 각 단계에서 원 $C_n$ 의 내부와 그에 내접하는 정사각형의 외부의 공통부분(원과 정사각형 사이)을 색칠할 때, 색칠한 모든 부분의 넓이의 합을 구하시오.`,
      `Draw the square inscribed in circle $C_1$ (radius ${r}), then the circle $C_2$ inscribed in that square, and repeat forever. Shade the region between each circle and its inscribed square. Find the total shaded area.`),
    explanation: T(`$C_1$ 에서 색칠한 넓이는 $\\pi\\cdot ${r}^2-2\\cdot ${r}^2=${r * r}\\pi-${2 * r * r}$ 이다.\n정사각형에 내접하는 원의 반지름은 $\\frac{1}{\\sqrt2}$ 배이므로 넓이는 매번 $\\frac12$ 배가 되어 공비가 $\\frac12$ 이다.\n따라서 합은 $\\frac{${r * r}\\pi-${2 * r * r}}{1-\\frac12}=${a}\\pi-${b}$`,
      `First shaded area $${r * r}\\pi-${2 * r * r}$, ratio $\\frac12$, so the total is $${a}\\pi-${b}$.`),
    verify: () => { let s = 0; let rad = r; for (let i = 0; i < 200; i += 1) { s += Math.PI * rad * rad - 2 * rad * rad; rad /= Math.SQRT2; } return near(s, a * Math.PI - b, 1e-9); },
  });
}

function quarterColoring(random, profile) {
  const A = 3 * ri(random, 2, 20);
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-geo-apps',
    prompt: T(`넓이가 $${A}$ 인 정사각형을 합동인 $4$개의 정사각형으로 나누어 그 중 하나를 색칠한다. 색칠하지 않은 $3$개의 정사각형 중 하나를 다시 합동인 $4$개의 정사각형으로 나누어 그 중 하나를 색칠한다. 이와 같은 과정을 한없이 반복할 때, 색칠한 모든 부분의 넓이의 합을 구하시오.`,
      `A square of area ${A} is cut into 4 congruent squares and one is shaded. One of the 3 unshaded squares is again cut into 4 and one is shaded, and so on forever. Find the total shaded area.`),
    answer: Fr(A, 3),
    explanation: T(`색칠한 넓이는 차례로 $\\frac{${A}}{4}, \\frac{${A}}{16}, \\frac{${A}}{64},\\cdots$ 으로 첫째항 $\\frac{${A}}{4}$, 공비 $\\frac14$ 인 등비수열이다.\n합은 $\\frac{${A}/4}{1-\\frac14}=${A / 3}$`,
      `Shaded areas form a geometric series with first term ${A}/4 and ratio 1/4: total ${A / 3}.`),
    verify: () => { let s = 0; let t = A / 4; for (let i = 0; i < 200; i += 1) { s += t; t /= 4; } return near(s, A / 3, 1e-9); },
  });
}

function triangleMidpointShading(random, profile) {
  const s = pick(random, [2, 4, 6, 8, 10]);
  const u = (s * s) / 4;
  const T = (ko, en) => tx(profile, ko, en);
  return finish(random, {
    tag: 'jc1-geo-apps',
    answer: { str: `${u}\\sqrt{3}`, num: u * Math.sqrt(3), wrong: [`${2 * u}\\sqrt{3}`, `${u / 2}\\sqrt{3}`, `${u}`, `${3 * u}\\sqrt{3}`] },
    prompt: T(`한 변의 길이가 $${s}$ 인 정삼각형의 각 변의 중점을 이어 만든 정삼각형(가운데)을 색칠한다. 남은 $3$개의 작은 정삼각형 각각에 대하여 같은 방법으로 가운데 정삼각형을 색칠한다. 이 과정을 한없이 반복할 때, 색칠한 모든 부분의 넓이의 합을 구하시오.`,
      `In an equilateral triangle of side ${s}, shade the medial triangle; repeat in each of the 3 remaining corner triangles, forever. Find the total shaded area.`),
    explanation: T(`처음 정삼각형의 넓이는 $\\frac{\\sqrt3}{4}\\cdot ${s}^2=${u}\\sqrt3$ 이다.\n첫 번째 색칠 넓이는 $\\frac14\\cdot ${u}\\sqrt3$, 다음 단계는 $3$개 각각 $\\frac{1}{16}\\cdot ${u}\\sqrt3$ 이므로 공비는 $\\frac34$ 이다.\n합 $=\\frac{\\frac14\\cdot ${u}\\sqrt3}{1-\\frac34}=${u}\\sqrt3$`,
      `Whole area $${u}\\sqrt3$; shaded areas form a series with ratio $3/4$ starting at a quarter, summing to $${u}\\sqrt3$.`),
    verify: () => { let s2 = 0; let t = u * Math.sqrt(3) / 4; let cnt = 1; for (let i = 0; i < 400; i += 1) { s2 += t * cnt; cnt *= 3; t /= 4; } return near(s2, u * Math.sqrt(3), 1e-6); },
  });
}

export const SERIES_ENGINES = {
  'jc1-seq-limit': [conjugateFindConstant, conjugateDifference, sequenceDegreeBalance, squeezeQuotient, ratioSubstitution, squaresSumLimit],
  'jc1-geo-limit': [geoRatioValue, geoTwoBases, geoFindConstant, partialSumRatio, geoPiecewiseSum],
  'jc1-series': [seriesTermLimit, telescopingKnown, telescopingShifted, geometricRecurrence, geometricFindSecond, parityWeightedSeries, convergenceIntegers],
  'jc1-graph-limit': [parabolaChord, radicalChord, verticalGap, hyperbolaIntersection],
  'jc1-geo-apps': [nestedSquaresTotal, nestedSquaresSide, bouncingBall, circleSquareRing, quarterColoring, triangleMidpointShading],
};
