/**
 * Removes source-brand annotations from text that is rendered to learners.
 * Internal catalog IDs are intentionally left unchanged for URL and saved-data compatibility.
 */
export function sanitizePublicText(value) {
  if (value === null || value === undefined) return value;

  return String(value)
    .replace(/\s*[（(]\s*RPM\b[^）)]*[）)]/gi, '')
    .replace(/\[\s*RPM\s+([^\]]+)\]/gi, '[$1]')
    .replace(/\bRPM\b/gi, '')
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}
