'use client';

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

function PlainMath({ value }) {
  const parts = String(value).split(/([+-]?\d+\s+\d+\/\d+|[+-]?\d+\/\d+)/g);
  return <>{parts.map((part, index) => {
    const mixed = part.match(/^([+-]?\d+)\s+(\d+)\/(\d+)$/);
    if (mixed) return <span className="mixed-fraction" key={index}><span className="whole-number">{mixed[1]}</span><span className="stacked-fraction"><span className="fraction-numerator">{mixed[2]}</span><span className="fraction-denominator">{mixed[3]}</span></span></span>;
    const fraction = part.match(/^([+-]?)(\d+)\/(\d+)$/);
    if (fraction) return <span className="signed-fraction" key={index}><span>{fraction[1]}</span><span className="stacked-fraction"><span className="fraction-numerator">{fraction[2]}</span><span className="fraction-denominator">{fraction[3]}</span></span></span>;
    return part ? <span key={index}>{part}</span> : null;
  })}</>;
}

/**
 * Renders the worksheet's compact plain-text math syntax for people while the
 * original string remains available to answer checking and seeded generation.
 * Supported examples: x^2, 3^x, 2^(x+3), log_2 x, lim_(x→2), a_{n+1}.
 */
export default function MathText({ value }) {
  const text = String(value ?? '');
  const nodes = [];
  let plain = '';
  let index = 0;
  const flush = () => {
    if (!plain) return;
    nodes.push(<PlainMath value={plain} key={`plain-${nodes.length}`} />);
    plain = '';
  };

  while (index < text.length) {
    const marker = text[index];
    if ((marker === '^' || marker === '_') && index + 1 < text.length) {
      const script = readScript(text, index + 1);
      if (script) {
        if (marker === '_' && plain.endsWith('lim')) {
          plain = plain.slice(0, -3);
          flush();
          nodes.push(
            <span className="math-limit" key={`limit-${index}`}>
              <span className="math-limit-operator">lim</span>
              <span className="math-limit-condition"><MathText value={script.value} /></span>
            </span>,
          );
          index = script.end;
          continue;
        }
        flush();
        const content = <MathText value={script.value} />;
        nodes.push(marker === '^'
          ? <sup className="math-sup" key={`script-${index}`}>{content}</sup>
          : <sub className="math-sub" key={`script-${index}`}>{content}</sub>);
        index = script.end;
        continue;
      }
    }
    plain += marker;
    index += 1;
  }
  flush();
  return <>{nodes}</>;
}
