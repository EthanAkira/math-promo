// ISO-3166 alpha-2 country → site language (codes from i18n.js LANGUAGES).
// Rule: the language of that country's education / employment, limited to the 15 languages the
// site ships. India is English by design; countries whose language we don't ship fall back to English.
const GROUPS = {
  ko: ['KR'],
  en: ['IN', 'US', 'CA', 'GB', 'IE', 'AU', 'NZ', 'ZA', 'PH', 'MY', 'NG', 'GH', 'KE', 'UG', 'TZ', 'ZM', 'ZW', 'PK', 'BD', 'LK', 'NP', 'JM', 'TT', 'BS', 'FJ', 'PG', 'RW', 'ET'],
  'en-SG': ['SG'],
  'zh-CN': ['CN'],
  'zh-HK': ['HK', 'MO'],
  'zh-TW': ['TW'],
  ja: ['JP'],
  vi: ['VN'],
  id: ['ID'],
  hi: [],
  fr: ['FR', 'BE', 'LU', 'MC', 'SN', 'CI', 'CM', 'CD', 'HT', 'GA', 'ML', 'BF', 'NE', 'TG', 'BJ', 'GN', 'MG', 'CH'],
  es: ['ES', 'MX', 'AR', 'CL', 'CO', 'PE', 'VE', 'EC', 'UY', 'PY', 'BO', 'CR', 'PA', 'GT', 'HN', 'SV', 'NI', 'DO', 'CU'],
  pt: ['PT', 'BR', 'AO', 'MZ'],
  ru: ['RU', 'BY', 'KZ', 'KG'],
  ar: ['SA', 'AE', 'QA', 'KW', 'BH', 'OM', 'YE', 'IQ', 'JO', 'LB', 'SY', 'EG', 'LY', 'SD', 'DZ', 'MA', 'TN', 'PS'],
};

const COUNTRY_TO_LANGUAGE = {};
for (const [language, countries] of Object.entries(GROUPS)) {
  for (const country of countries) COUNTRY_TO_LANGUAGE[country] = language;
}

export function languageForCountry(country) {
  return COUNTRY_TO_LANGUAGE[String(country || '').toUpperCase()] || null;
}

// Browser-language fallback when the country is unknown (local dev, blocked geo lookup).
export function languageForBrowser(tag, supported) {
  const value = String(tag || '').toLowerCase();
  if (!value) return null;
  if (value === 'zh-hk' || value === 'zh-mo' || value.startsWith('zh-hant-hk')) return supported.includes('zh-HK') ? 'zh-HK' : null;
  if (value === 'zh-tw' || value.startsWith('zh-hant')) return supported.includes('zh-TW') ? 'zh-TW' : null;
  if (value.startsWith('zh')) return supported.includes('zh-CN') ? 'zh-CN' : null;
  if (value === 'en-sg') return supported.includes('en-SG') ? 'en-SG' : null;
  const base = value.split('-')[0];
  return supported.includes(base) ? base : null;
}
