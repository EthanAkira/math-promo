// Converts the LaTeX markup some generators emit ($...$, \log_{5}, \left( ...) into the plain
// notation MathText already knows how to typeset (and that matches Korean exam print style:
// no dollar signs, no backslashes). \frac is left alone — MathText renders it as a stacked fraction.

const SYMBOLS = {
  cdot: '·', times: '×', div: '÷', pm: '±', mp: '∓', ge: '≥', geq: '≥', le: '≤', leq: '≤', ne: '≠', neq: '≠',
  to: '→', rightarrow: '→', implies: '⇒', Rightarrow: '⇒', iff: '⇔', circ: '°', angle: '∠', triangle: '△',
  infty: '∞', int: '∫', sum: '∑', pi: 'π', alpha: 'α', beta: 'β', gamma: 'γ', delta: 'δ', theta: 'θ',
  lambda: 'λ', mu: 'μ', sigma: 'σ', phi: 'φ', omega: 'ω', Delta: 'Δ', Sigma: 'Σ', perp: '⊥', parallel: '∥',
  ldots: '…', cdots: '…', approx: '≈', in: '∈', cup: '∪', cap: '∩', subset: '⊂',
};
const WORDS = new Set(['log', 'ln', 'sin', 'cos', 'tan', 'sec', 'csc', 'cot', 'lim', 'max', 'min', 'exp']);
const SUP_DIGITS = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const BS = String.fromCharCode(92);

function readBraced(text, start) {
  if (text[start] !== '{') return null;
  let depth = 0;
  for (let i = start; i < text.length; i += 1) {
    if (text[i] === '{') depth += 1;
    else if (text[i] === '}') { depth -= 1; if (depth === 0) return { value: text.slice(start + 1, i), end: i + 1 }; }
  }
  return null;
}

export function hasLatex(value) {
  const s = String(value ?? '');
  return s.includes('$') || s.includes(BS);
}

export function latexToPlain(input) {
  const text = String(input ?? '').replace(/\$\$?/g, '');
  let out = '';
  let i = 0;
  while (i < text.length) {
    const ch = text[i];
    if (ch !== BS) { out += ch; i += 1; continue; }

    if (text[i + 1] === BS) { out += '\n'; i += 2; continue; }
    const m = text.slice(i + 1).match(/^[a-zA-Z]+/);
    if (!m) { // \, \; \! and escaped characters
      const next = text[i + 1];
      out += (next === ',' || next === ';' || next === ' ' || next === ':') ? ' ' : (next === '!' ? '' : (next ?? ''));
      i += 2;
      continue;
    }
    const name = m[0];
    i += 1 + name.length;

    if (name === 'frac' || name === 'dfrac' || name === 'tfrac') { out += `${BS}frac`; continue; }
    if (name === 'left' || name === 'right') { if (text[i] === '.') i += 1; continue; }
    if (name === 'sqrt') {
      let index = '';
      if (text[i] === '[') {
        const close = text.indexOf(']', i);
        if (close > 0) { index = text.slice(i + 1, close); i = close + 1; }
      }
      const g = readBraced(text, i);
      const body = g ? latexToPlain(g.value) : '';
      if (g) i = g.end;
      const idx = index && index !== '2' ? (/^\d+$/.test(index) ? Array.from(index).map((d) => SUP_DIGITS[d]).join('') : `^(${index})`) : '';
      out += `${idx}√(${body})`;
      continue;
    }
    if (name === 'vec' || name === 'overrightarrow') {
      const g = readBraced(text, i);
      if (g) { i = g.end; out += `${latexToPlain(g.value)}⃗`; }
      continue;
    }
    if (name === 'overline') {
      const g = readBraced(text, i);
      if (g) { i = g.end; out += latexToPlain(g.value); }
      continue;
    }
    if (name === 'text' || name === 'mathrm' || name === 'mathbf' || name === 'operatorname') {
      const g = readBraced(text, i);
      if (g) { i = g.end; out += g.value; }
      continue;
    }
    if (name === 'begin' || name === 'end') {
      const g = readBraced(text, i);
      if (g) i = g.end;
      if (name === 'begin' && g && g.value === 'cases') out += '{ ';
      continue;
    }
    if (name === 'quad' || name === 'qquad') { out += '  '; continue; }
    if (SYMBOLS[name]) { out += SYMBOLS[name]; continue; }
    if (WORDS.has(name)) { out += name; continue; }
    out += name; // unknown command: keep the bare word rather than leak a backslash
  }
  return out
    .replace(/\^\s*°/g, '°')
    .replace(/&/g, '   ');
}
