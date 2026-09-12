import { decodeHwpPua } from './utils/hwpPuaDecoder';

/**
 * Removes source-brand annotations from text that is rendered to learners
 * and decodes any HWP/KICE PUA characters into standard readable math glyphs.
 * Internal catalog IDs are intentionally left unchanged for URL and saved-data compatibility.
 */
export function sanitizePublicText(value) {
  if (value === null || value === undefined) return value;

  const decoded = decodeHwpPua(String(value));

  return decoded
    .replace(/\s*[（(]\s*RPM\b[^）)]*[）)]/gi, '')
    .replace(/\[\s*RPM\s+([^\]]+)\]/gi, '[$1]')
    .replace(/\bRPM\b/gi, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}
