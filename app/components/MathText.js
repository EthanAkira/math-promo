'use client';

import { sanitizePublicText } from '../publicText';

const NON_FRACTIONS = new Set(['and/or', 'either/or', 'true/false', 'yes/no', 'input/output', 'km/h', 'm/s', 'cm/s', 'm/s^2']);

function isMathFraction(num, den, raw) {
  const norm = String(raw || '').toLowerCase().replace(/\s+/g, '');
  if (NON_FRACTIONS.has(norm)) return false;
  if (/^[a-zA-Z]{3,}$/.test(num) && /^[a-zA-Z]{2,}$/.test(den)) return false;
  return true;
}

function stripEnclosingParens(str) {
  const s = String(str ?? '').trim();
  if (s.startsWith('(') && s.endsWith(')')) {
    let depth = 0;
    for (let i = 0; i < s.length; i += 1) {
      if (s[i] === '(') depth += 1;
      else if (s[i] === ')') {
        depth -= 1;
        if (depth === 0 && i < s.length - 1) return s;
      }
    }
    if (depth === 0) return s.slice(1, -1).trim();
  }
  return s;
}

function readGrouped(text, start, opening, closing) {
  let depth = 0;
  for (let index = start; index < text.length; index += 1) {
    if (text[index] === opening) depth += 1;
    if (text[index] === closing) depth -= 1;
    if (depth === 0) return { value: text.slice(start + 1, index), end: index + 1 };
  }
  return null;
}

function readScript(text, start) {
  if (text[start] === '(') return readGrouped(text, start, '(', ')');
  if (text[start] === '{') return readGrouped(text, start, '{', '}');

  let index = start;
  let value = '';
  if (['+', '-', '−', '±'].includes(text[index])) {
    value += text[index];
    index += 1;
  }
  if (/\d/.test(text[index] || '')) {
    while (/\d/.test(text[index] || '')) { value += text[index]; index += 1; }
    if (text[index] === '.' && /\d/.test(text[index + 1] || '')) {
      value += text[index]; index += 1;
      while (/\d/.test(text[index] || '')) { value += text[index]; index += 1; }
    }
  } else if (text[index]) {
    const codePoint = String.fromCodePoint(text.codePointAt(index));
    value += codePoint;
    index += codePoint.length;
  }
  return value ? { value, end: index } : null;
}

function tokenizeMath(input) {
  let text = String(input ?? '');
  const unicodeSupMap = {
    '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4',
    '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
    '⁺': '+', '⁻': '-', '⁼': '=', '⁽': '(', '⁾': ')',
    'ⁿ': 'n', 'ⁱ': 'i', 'ˣ': 'x', 'ʸ': 'y',
  };
  text = text.replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁺⁻⁼⁽⁾ⁿⁱˣʸ]+/g, (m) => `^(${Array.from(m).map((c) => unicodeSupMap[c] || c).join('')})`);

  const tokens = [];
  let index = 0;

  while (index < text.length) {
    const sub = text.slice(index);

    // 1. LaTeX \frac or \dfrac
    const fracPrefix = sub.match(/^\\(?:d?frac)\s*\{/);
    if (fracPrefix) {
      const numStart = index + fracPrefix[0].length - 1;
      const numGroup = readGrouped(text, numStart, '{', '}');
      if (numGroup) {
        const afterNum = text.slice(numGroup.end);
        const denPrefix = afterNum.match(/^\s*\{/);
        if (denPrefix) {
          const denStart = numGroup.end + denPrefix[0].length - 1;
          const denGroup = readGrouped(text, denStart, '{', '}');
          if (denGroup) {
            tokens.push({
              type: 'fraction',
              sign: '',
              num: numGroup.value,
              den: denGroup.value,
              raw: text.slice(index, denGroup.end),
            });
            index = denGroup.end;
            continue;
          }
        }
      }
    }

    // 2. Permutation / Combination notation: nPr, nCr, nHr, nΠr, 5P2, 10C3, _n\text{P}_r, {}_n\mathrm{P}_r
    const permMatch = sub.match(/^(?:\{\s*\}|_)?_?([0-9]+|[a-zA-Z]|\([^)]+\)|\{[^}]+\})\s*(?:\\(?:mathrm|text)\{([PCHΠ])\}|([PCHΠ]|\\Pi))\s*_?([0-9]+|[a-zA-Z]|\([^)]+\)|\{[^}]+\})(?=\s|$|[([=+\-*\/~·\uac00-\ud7a3.,;:!?\)\]\}])/);
    if (permMatch) {
      const prevChar = index > 0 ? text[index - 1] : '';
      if (!/[a-zA-Z0-9]/.test(prevChar)) {
        const op = permMatch[2] || permMatch[3];
        const cleanLeft = permMatch[1].replace(/^\{|\}$/g, '').replace(/^_/, '');
        const cleanRight = permMatch[4].replace(/^\{|\}$/g, '').replace(/^_/, '');
        const cleanOp = (op === '\\Pi' || op === 'Π') ? 'Π' : op;
        tokens.push({
          type: 'perm_comb',
          left: stripEnclosingParens(cleanLeft),
          op: cleanOp,
          right: stripEnclosingParens(cleanRight),
          raw: permMatch[0],
        });
        index += permMatch[0].length;
        continue;
      }
    }

    // 3. Mixed fraction (e.g. 1 2/3, -2 1/4)
    const mixedMatch = sub.match(/^([+-]?\d+)\s+(\d+)\/(\d+)(?![a-zA-Z0-9/])/);
    if (mixedMatch) {
      const prevChar = index > 0 ? text[index - 1] : '';
      if (!/[a-zA-Z0-9]/.test(prevChar)) {
        tokens.push({
          type: 'mixed_fraction',
          whole: mixedMatch[1],
          num: mixedMatch[2],
          den: mixedMatch[3],
          raw: mixedMatch[0],
        });
        index += mixedMatch[0].length;
        continue;
      }
    }

    // 4. Slash fraction: 3/4, -5/8, x/2, 12/x, (x+1)/2, (a+b)/(c+d), 2x/3, etc.
    const slashMatch = sub.match(/^([+-]?(?:(?:\([^()]+\)|[0-9]*[a-zA-Z]+|\d+)(?:\^[0-9a-zA-Z]+|\^\{[^}]+\})*))\s*\/\s*((?:(?:\([^()]+\)|[0-9]*[a-zA-Z]+|\d+)(?:\^[0-9a-zA-Z]+|\^\{[^}]+\})*))(?![a-zA-Z0-9/])/);
    if (slashMatch && isMathFraction(slashMatch[1], slashMatch[2], slashMatch[0])) {
      const prevChar = index > 0 ? text[index - 1] : '';
      if (!/[a-zA-Z0-9/\\]/.test(prevChar)) {
        let num = slashMatch[1].trim();
        let sign = '';
        if (num.startsWith('-') || num.startsWith('+') || num.startsWith('−')) {
          sign = num[0] === '−' ? '-' : num[0];
          num = num.slice(1).trim();
        }
        tokens.push({
          type: 'fraction',
          sign,
          num: stripEnclosingParens(num),
          den: stripEnclosingParens(slashMatch[2]),
          raw: slashMatch[0],
        });
        index += slashMatch[0].length;
        continue;
      }
    }

    // 5. Superscript (^) or Subscript (_)
    const marker = text[index];
    if ((marker === '^' || marker === '_') && index + 1 < text.length) {
      const script = readScript(text, index + 1);
      if (script) {
        if (marker === '_' && tokens.length > 0 && typeof tokens[tokens.length - 1] === 'string' && tokens[tokens.length - 1].endsWith('lim')) {
          tokens[tokens.length - 1] = tokens[tokens.length - 1].slice(0, -3);
          tokens.push({
            type: 'limit',
            value: script.value,
          });
          index = script.end;
          continue;
        }
        tokens.push({
          type: marker === '^' ? 'sup' : 'sub',
          value: script.value,
        });
        index = script.end;
        continue;
      }
    }

    // 6. Radical (√): √(...) or √123 (bare numeric radicand only, to avoid swallowing trailing units/text)
    if (text[index] === '√') {
      const radStart = index + 1;
      if (text[radStart] === '(') {
        const group = readGrouped(text, radStart, '(', ')');
        if (group) {
          tokens.push({ type: 'radical', value: group.value, raw: text.slice(index, group.end) });
          index = group.end;
          continue;
        }
      } else {
        const numMatch = sub.slice(1).match(/^\d+(\.\d+)?/);
        if (numMatch && numMatch[0]) {
          tokens.push({ type: 'radical', value: numMatch[0], raw: `√${numMatch[0]}` });
          index += 1 + numMatch[0].length;
          continue;
        }
      }
    }

    // 7. Plain character
    if (tokens.length > 0 && typeof tokens[tokens.length - 1] === 'string') {
      tokens[tokens.length - 1] += text[index];
    } else {
      tokens.push(text[index]);
    }
    index += 1;
  }

  return tokens;
}

/**
 * MathText renders mathematics cleanly for worksheets, question prompts, choices, and answer sheets:
 * 1. Fractions: rendered as stacked vertical fractions with horizontal bar (never a bare slash '/').
 * 2. Powers/Exponents: rendered as superscript (never a bare caret '^').
 * 3. Permutations & Combinations (nPr, nCr, nHr, nΠr): rendered with small subscript n and r flanking the operator.
 * 4. Radicals (√): rendered with a horizontal vinculum over the radicand (never a bare '√' glyph with no bar).
 */
export default function MathText({ value }) {
  if (value === null || value === undefined || value === '') return null;
  const tokens = tokenizeMath(sanitizePublicText(value));

  return (
    <>
      {tokens.map((tok, idx) => {
        if (typeof tok === 'string') {
          return <span key={idx}>{tok}</span>;
        }
        if (tok.type === 'mixed_fraction') {
          return (
            <span className="mixed-fraction" key={idx}>
              <span className="whole-number">{tok.whole}</span>
              <span className="stacked-fraction">
                <span className="fraction-numerator"><MathText value={tok.num} /></span>
                <span className="fraction-denominator"><MathText value={tok.den} /></span>
              </span>
            </span>
          );
        }
        if (tok.type === 'fraction') {
          return (
            <span className="signed-fraction" key={idx}>
              {tok.sign ? <span>{tok.sign}</span> : null}
              <span className="stacked-fraction">
                <span className="fraction-numerator"><MathText value={tok.num} /></span>
                <span className="fraction-denominator"><MathText value={tok.den} /></span>
              </span>
            </span>
          );
        }
        if (tok.type === 'perm_comb') {
          return (
            <span className="math-perm-comb" key={idx}>
              <sub className="math-perm-sub-left"><MathText value={tok.left} /></sub>
              <span className="math-perm-op">{tok.op}</span>
              <sub className="math-perm-sub-right"><MathText value={tok.right} /></sub>
            </span>
          );
        }
        if (tok.type === 'radical') {
          return (
            <span className="math-radical" key={idx}>
              <span className="radical-symbol">√</span>
              <span className="radical-radicand"><MathText value={tok.value} /></span>
            </span>
          );
        }
        if (tok.type === 'sup') {
          return (
            <sup className="math-sup" key={idx}>
              <MathText value={tok.value} />
            </sup>
          );
        }
        if (tok.type === 'sub') {
          return (
            <sub className="math-sub" key={idx}>
              <MathText value={tok.value} />
            </sub>
          );
        }
        if (tok.type === 'limit') {
          return (
            <span className="math-limit" key={idx}>
              <span className="math-limit-operator">lim</span>
              <span className="math-limit-condition"><MathText value={tok.value} /></span>
            </span>
          );
        }
        return null;
      })}
    </>
  );
}
