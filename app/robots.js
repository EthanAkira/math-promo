import { SITE_URL, SITEMAP_EXCLUDED_PREFIXES } from './siteConfig';

export default function robots() {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: [...SITEMAP_EXCLUDED_PREFIXES, '/api/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
