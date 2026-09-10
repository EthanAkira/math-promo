'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';
import MathText from './MathText';
import { sanitizePublicText } from '../publicText';

export function transformLatexMath(latex) {
  if (!latex) return latex;
  let s = String(latex);

  // 1. Permutations & Combinations (nPr, nCr, nHr, nΠr, 5P2, 10C3, _n\text{P}_r, {}_n\mathrm{P}_r)
  s = s.replace(/(?:\{\s*\}|_)?_?([0-9]+|[a-zA-Z]|\([^)]+\)|\{[^}]+\})\s*(?:\\(?:mathrm|text)\{([PCHΠ])\}|([PCHΠ]|\\Pi))\s*_?([0-9]+|[a-zA-Z]|\([^)]+\)|\{[^}]+\})/g, (match, left, op1, op2, right) => {
    const op = op1 || op2;
    const cleanLeft = left.replace(/^\{|\}$/g, '').replace(/^_/, '');
    const cleanRight = right.replace(/^\{|\}$/g, '').replace(/^_/, '');
    const cleanOp = (op === '\\Pi' || op === 'Π') ? '\\Pi' : `\\mathrm{${op}}`;
    return `{}_{${cleanLeft}}${cleanOp}_{${cleanRight}}`;
  });

  // 2. Slash fractions inside LaTeX math -> \frac{num}{den}
  s = s.replace(/(?<![\\a-zA-Z0-9])([+-]?(?:(?:\([^()]+\)|[0-9]*[a-zA-Z]+|\d+)(?:\^[0-9a-zA-Z]+|\^\{[^}]+\})*))\s*\/\s*((?:(?:\([^()]+\)|[0-9]*[a-zA-Z]+|\d+)(?:\^[0-9a-zA-Z]+|\^\{[^}]+\})*))(?![a-zA-Z0-9/])/g, (match, num, den) => {
    let cleanNum = num.trim();
    let sign = '';
    if (cleanNum.startsWith('-') || cleanNum.startsWith('+') || cleanNum.startsWith('−')) {
      sign = cleanNum[0] === '−' ? '-' : cleanNum[0];
      cleanNum = cleanNum.slice(1).trim();
    }
    if (cleanNum.startsWith('(') && cleanNum.endsWith(')')) cleanNum = cleanNum.slice(1, -1);
    let cleanDen = den.trim();
    if (cleanDen.startsWith('(') && cleanDen.endsWith(')')) cleanDen = cleanDen.slice(1, -1);
    return `${sign}\\frac{${cleanNum}}{${cleanDen}}`;
  });

  return s;
}

// Tokenize text into plain text, inline math ($...$), and block math ($$...$$)
export function tokenizeLatex(text) {
  if (!text) return [];
  const tokens = [];
  const regex = /\$\$([\s\S]+?)\$\$|\$([^$\n]+?)\$/g;
  let lastIndex = 0;
  let match;
  while ((match = regex.exec(text))) {
    if (match.index > lastIndex) {
      tokens.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    if (match[1] !== undefined) {
      tokens.push({ type: 'block', value: match[1].trim() });
    } else if (match[2] !== undefined) {
      tokens.push({ type: 'inline', value: match[2].trim() });
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return tokens;
}

export default function LatexMath({ text, style, className }) {
  if (!text) return null;
  const tokens = tokenizeLatex(sanitizePublicText(text));

  return (
    <span className={className} style={{ display: 'inline', ...style }}>
      {tokens.map((token, i) => {
        if (token.type === 'text') {
          return <MathText key={i} value={token.value} />;
        }
        try {
          const transformed = transformLatexMath(token.value);
          const html = katex.renderToString(transformed, {
            throwOnError: false,
            displayMode: token.type === 'block',
          });
          return (
            <span
              key={i}
              className={token.type === 'block' ? 'katex-block-wrapper' : 'katex-inline-wrapper'}
              style={token.type === 'block' ? { display: 'block', margin: '8px 0', textAlign: 'center' } : { display: 'inline' }}
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <MathText key={i} value={token.value} />;
        }
      })}
    </span>
  );
}
