// ILLUMIA LAB canonical domain
export const SITE_URL = 'https://illumialab.com';

// Routes that must never appear in the sitemap: admin tools, a logged-in-only
// personal page, and the unlinked legacy elementary/addition generator.
export const SITEMAP_EXCLUDED_PREFIXES = [
  '/amc/admin',
  '/csat/admin',
  '/curriculum/admin',
  '/dashboard',
  '/elementary/addition',
];
