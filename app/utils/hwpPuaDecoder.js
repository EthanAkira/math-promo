/**
 * Korean CSAT / HWP (Hancom) Equation Font PUA Decoder
 *
 * In PDFs exported from Hancom Office / HWP by KICE (한국교육과정평가원),
 * mathematical expressions rendered with the HyhwpEQ / Hancom fonts
 * use characters in Unicode Private Use Area (PUA: U+E000 ~ U+F8FF).
 * Without mapping, these characters render as missing glyphs (tofu boxes: □).
 *
 * This utility translates all known HWP equation PUA characters
 * into standard readable Unicode / ASCII mathematical symbols and cleans
 * examination headers/watermarks.
 */

const PUA_SYMBOL_MAP = {
  '\uE044': '(',
  '\uE045': ')',
  '\uE046': '-',
  '\uE047': '=',
  '\uE048': '+',
  '\uE04B': '{',
  '\uE04C': '}',
  '\uE04F': '[',
  '\uE052': ', ',
  '\uE053': '.',
  '\uE055': '<',
  '\uE056': '>',
  '\uE05B': '≥',
  '\uE05C': '√',
  '\uE067': '∑',
  '\uE06D': '/',
  '\uE06E': '→',
  '\uE078': '{',
  '\uE079': '|',
  '\uE07A': '}',
  '\uE07B': '|',
  '\uE0A4': 'θ',
  '\uE0AC': 'π',
  '\uE101': '|',
};

const GREEK_LOWERCASE = [
  'α', 'β', 'γ', 'δ', 'ε', 'ζ', 'η', 'θ', 'ι', 'κ',
  'λ', 'μ', 'ν', 'ξ', 'ο', 'π', 'ρ', 'σ', 'τ', 'υ',
  'φ', 'χ', 'ψ', 'ω',
];

/**
 * Decodes all Hancom HWP equation PUA characters into readable Unicode characters.
 */
export function decodeHwpPua(input) {
  if (!input) return input;
  const str = String(input);

  // Fast check: return early if no PUA or replacement chars present
  let hasPua = false;
  for (let i = 0; i < str.length; i++) {
    const code = str.charCodeAt(i);
    if ((code >= 0xe000 && code <= 0xf8ff) || code === 0xfffd) {
      hasPua = true;
      break;
    }
  }
  if (!hasPua) return str;

  const chars = [];
  for (let i = 0; i < str.length; i++) {
    const ch = str[i];
    const code = str.charCodeAt(i);

    // 1. Uppercase Latin: U+E000 ~ U+E019 -> A ~ Z
    if (code >= 0xe000 && code <= 0xe019) {
      chars.push(String.fromCharCode(65 + code - 0xe000));
    }
    // 2. Digits: U+E034 ~ U+E03C -> 1 ~ 9, U+E03D -> 0
    else if (code >= 0xe034 && code <= 0xe03c) {
      chars.push(String.fromCharCode(49 + code - 0xe034));
    } else if (code === 0xe03d) {
      chars.push('0');
    }
    // 3. Lowercase Latin: U+E0E5 ~ U+E0FE -> a ~ z
    else if (code >= 0xe0e5 && code <= 0xe0fe) {
      chars.push(String.fromCharCode(97 + code - 0xe0e5));
    }
    // 4. Greek lowercase: U+E09B ~ U+E0B4
    else if (code >= 0xe09b && code <= 0xe0b4) {
      chars.push(GREEK_LOWERCASE[code - 0xe09b] || 'θ');
    }
    // 5. Explicit math symbols
    else if (PUA_SYMBOL_MAP[ch]) {
      chars.push(PUA_SYMBOL_MAP[ch]);
    }
    // 6. Any other unmapped PUA code: strip or replace with space
    else if (code >= 0xe000 && code <= 0xf8ff) {
      chars.push(' ');
    }
    // 7. Unicode replacement character
    else if (code === 0xfffd) {
      chars.push(' ');
    } else {
      chars.push(ch);
    }
  }

  let result = chars.join('');

  // Normalize common HWP equation artifacts:
  // e.g. "√/3" -> "√3"
  result = result.replace(/√\s*\/\s*([0-9a-zA-Z]+)/g, '√$1');
  // e.g. "/ 4 1" or "/4 1" -> "1/4"
  result = result.replace(/\/\s*([0-9a-zA-Z]+)\s+([0-9a-zA-Z]+)/g, '$2/$1');
  // Clean up case braces "{ | } | |"
  result = result.replace(/\{\s*\|\s*\}\s*\|\s*\|/g, '{');

  return result;
}

/**
 * Removes KICE headers, copyright disclaimers, booklet type marks, and page numbering
 * noise from problem text.
 */
export function cleanCsatProblemText(input) {
  if (!input) return input;
  let text = decodeHwpPua(input);

  text = text
    .replace(/이\s*문제(?:지)?에\s*관한\s*저작권은\s*한국교육과정평가원에\s*있습니다\.?/gi, '')
    .replace(/(?:홀수형|짝수형)\s*(?:\([^)]*\))?(?:\s+\d+)*/gi, '')
    .replace(/\b(?:5\s*지선다형|단답형)\b/gi, '')
    .replace(/제\s*2\s*교시\s*수학\s*영역/gi, '')
    .replace(/\d{4}학년도\s*대학수학능력시험\s*문제지/gi, '')
    .replace(/\b\d{1,2}\s+(?:20|30)\b/g, '') // e.g. "7 20", "20 5"
    .replace(/[ \t]{2,}/g, ' ')
    .trim();

  return text;
}
