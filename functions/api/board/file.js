import { CORS_HEADERS } from './_shared.js';

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const key = url.searchParams.get('key');
  if (!key || !key.startsWith('board-file:')) {
    return new Response('Not found', { status: 404 });
  }

  const result = await env.AMC_FILES.getWithMetadata(key, 'arrayBuffer');
  if (!result || !result.value) {
    return new Response('Not found', { status: 404 });
  }

  const metadata = result.metadata || {};
  const contentType = metadata.contentType || 'application/octet-stream';
  const filename = metadata.filename || 'image';
  const canPreviewInline = contentType.startsWith('image/') || contentType === 'application/pdf';
  const disposition = canPreviewInline ? 'inline' : 'attachment';

  return new Response(result.value, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `${disposition}; filename="${filename.replace(/"/g, '')}"`,
      'Cache-Control': 'public, max-age=3600',
      ...CORS_HEADERS,
    },
  });
}
