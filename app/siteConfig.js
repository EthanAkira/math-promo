// Cloudflare Pages project has no custom domain attached (verified via
// `wrangler pages project list`), so this is the real canonical origin.
export const SITE_URL = 'https://math-promo.pages.dev';

// Routes that must never appear in the sitemap: admin tools, a logged-in-only
// personal page, and the unlinked legacy elementary/addition generator.
export const SITEMAP_EXCLUDED_PREFIXES = [
  '/amc/admin',
  '/csat/admin',
  '/curriculum/admin',
  '/dashboard',
  '/elementary/addition',
];
