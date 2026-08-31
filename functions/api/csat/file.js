import { CORS_HEADERS } from './_shared.js';
import { getArchiveItemByFileKey, hasActiveSubscription } from '../_archive.js';
import { getSessionUser } from '../auth/_shared.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!key || !key.startsWith('csatfile:')) {
    return new Response('Not found', { status: 404 });
  }

  const tag = await getArchiveItemByFileKey(env.DB, key);
  if (tag && tag.access_tier === 'premium') {
    const user = env.DB ? await getSessionUser(env.DB, request) : null;
    const entitled = user && await hasActiveSubscription(env.DB, user.id, 'csat');
    if (!entitled) {
      return jsonResponse403();
    }
  }

  const result = await env.AMC_FILES.getWithMetadata(key, 'arrayBuffer');
  if (!result || !result.value) {
    return new Response('Not found', { status: 404 });
  }

  const metadata = result.metadata || {};
  const contentType = metadata.contentType || 'application/octet-stream';
  const filename = metadata.filename || 'file';
  const disposition = url.searchParams.get('download') ? 'attachment' : 'inline';

  return new Response(result.value, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `${disposition}; filename="${filename.replace(/"/g, '')}"`,
      'Cache-Control': 'public, max-age=3600',
      ...CORS_HEADERS,
    },
  });
}

function jsonResponse403() {
  return new Response(JSON.stringify({ error: 'A premium CSAT subscription is required to access this file.' }), {
    status: 403,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}
