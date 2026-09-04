'use client';

import katex from 'katex';
import 'katex/dist/katex.min.css';

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
  const tokens = tokenizeLatex(String(text));

  return (
    <span className={className} style={{ display: 'inline', ...style }}>
      {tokens.map((token, i) => {
        if (token.type === 'text') {
          return <span key={i}>{token.value}</span>;
        }
        try {
          const html = katex.renderToString(token.value, {
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
          return <code key={i}>{token.value}</code>;
        }
      })}
    </span>
  );
}
