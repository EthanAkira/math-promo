import { CURRICULUM_CATALOG } from './curriculumCatalog';
import { SITE_URL, SITEMAP_EXCLUDED_PREFIXES } from './siteConfig';

// Every generator page below is reachable through the homepage's curriculum explorer;
// listing them individually (plus the validated CURRICULUM_CATALOG query-string variants)
// gives crawlers a direct path to each without relying on client-side navigation.
const STATIC_ROUTES = [
  { path: '/', priority: 1, changeFrequency: 'weekly' },
  { path: '/amc', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/amc/8', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/amc/10', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/amc/12', priority: 0.7, changeFrequency: 'yearly' },
  { path: '/csat', priority: 0.8, changeFrequency: 'monthly' },
  { path: '/csat/june', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/csat/sept', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/csat/nov', priority: 0.6, changeFrequency: 'yearly' },
  { path: '/notices', priority: 0.5, changeFrequency: 'weekly' },
  { path: '/contact', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/elementary/practice', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/middle-school/prime-factorization', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/middle-school/gcd-lcm', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/middle-school/integers-rationals', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/middle-school/algebra-basics', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/middle-school/coordinate-plane', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/middle-school/proportion', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/middle-school/pre-algebra', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/middle-school/basic-figures', priority: 0.9, changeFrequency: 'monthly' },
  { path: '/games', priority: 0.4, changeFrequency: 'monthly' },
  { path: '/games/chess', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/games/gomoku', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/games/sudoku', priority: 0.3, changeFrequency: 'yearly' },
  { path: '/games/yutnori', priority: 0.3, changeFrequency: 'yearly' },
];

function isExcluded(path) {
  return SITEMAP_EXCLUDED_PREFIXES.some((prefix) => path === prefix || path.startsWith(`${prefix}/`) || path.startsWith(`${prefix}?`));
}

// Next's sitemap serializer writes <loc> as raw text without XML-escaping it, so a query
// string's bare `&` produces invalid XML (`&` must be `&amp;` outside of a real entity).
function xmlSafeUrl(path) {
  return `${SITE_URL}${path}`.replace(/&/g, '&amp;');
}

export default function sitemap() {
  const entries = new Map();

  for (const route of STATIC_ROUTES) {
    entries.set(route.path, { url: xmlSafeUrl(route.path), changeFrequency: route.changeFrequency, priority: route.priority });
  }

  // Deep-link every evidence-validated, publicly visible catalog node (PRD §9 공개 정책:
  // only validated/localized/published nodes may be public) so specific units are indexable,
  // not just the generator's base page.
  for (const node of CURRICULUM_CATALOG.nodes) {
    if (node.visibility !== 'public' || !node.route || isExcluded(node.route)) continue;
    if (entries.has(node.route)) continue;
    entries.set(node.route, { url: xmlSafeUrl(node.route), changeFrequency: 'monthly', priority: 0.6 });
  }

  return [...entries.values()];
}
