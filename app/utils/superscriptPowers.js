// Plain-text contexts (headings, <option> labels) cannot render markup, so show exponents written as
// "x^2", "(-1)^n", "a^{m+n}" with Unicode superscripts ("x²", "(-1)ⁿ", "aᵐ⁺ⁿ") instead of a raw caret.
const SUP = {
  0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹',
  '+': '⁺', '-': '⁻', '−': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ', j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ',
  n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ', t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
};

function toSup(exp) {
  const chars = Array.from(exp.replace(/\s+/g, ''));
  if (!chars.length || !chars.every((ch) => SUP[ch] || SUP[ch.toLowerCase()])) return null;
  return chars.map((ch) => SUP[ch] || SUP[ch.toLowerCase()]).join('');
}

export function superscriptPowers(text) {
  if (typeof text !== 'string' || !text.includes('^')) return text;
  return text.replace(/\^\{([^}]*)\}|\^\(([^)]*)\)|\^([+-]?\d+|[A-Za-z])/g, (whole, braced, paren, plain) => {
    const sup = toSup(braced ?? paren ?? plain);
    return sup ?? whole;
  });
}
