// Public: the visitor's ISO country code as seen by Cloudflare (used to pick the first-visit language).
export async function onRequestGet({ request }) {
  const country = request.cf?.country || request.headers.get('CF-IPCountry') || '';
  return new Response(JSON.stringify({ country: /^[A-Za-z]{2}$/.test(country) ? country.toUpperCase() : '' }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' },
  });
}
