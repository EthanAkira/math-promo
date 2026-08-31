import { readBoard, writeBoard, jsonResponse, postImageKey, CORS_HEADERS, isAdminPassword } from './_shared.js';

const MAX_BYTES = 8 * 1024 * 1024;
const MAX_ATTACHMENT_BYTES = 20 * 1024 * 1024;

export async function onRequestPost({ request, env }) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid form data.' }, { status: 400 });
  }

  if (!isAdminPassword(env, formData.get('password'))) {
    return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
  }

  const id = String(formData.get('id') || '');
  const posts = await readBoard(env.AMC_FILES);
  const post = posts.find((item) => item.id === id);
  if (!post) return jsonResponse({ error: 'Post not found.' }, { status: 404 });

  const message = String(formData.get('message') || '').trim().slice(0, 4000);
  if (!message) return jsonResponse({ error: 'Message is required.' }, { status: 400 });
  post.message = message;

  const name = formData.get('name');
  if (name != null) post.name = String(name).trim().slice(0, 60) || null;

  if (formData.get('removeAttachment') === '1' && post.image?.key) {
    await env.AMC_FILES.delete(post.image.key);
    post.image = null;
  }

  const file = formData.get('image');
  if (file && typeof file.arrayBuffer === 'function' && file.size > 0) {
    const maxBytes = post.category === 'coding' ? MAX_ATTACHMENT_BYTES : MAX_BYTES;
    if (file.size > maxBytes) return jsonResponse({ error: 'Attachment is too large.' }, { status: 400 });
    if (post.image?.key) await env.AMC_FILES.delete(post.image.key);
    const key = postImageKey(id);
    const contentType = file.type || 'application/octet-stream';
    const bytes = await file.arrayBuffer();
    await env.AMC_FILES.put(key, bytes, { metadata: { contentType, filename: file.name || 'image' } });
    post.image = { key, filename: file.name || 'image', contentType };
  }

  post.updatedAt = new Date().toISOString();
  await writeBoard(env.AMC_FILES, posts);

  return jsonResponse({ ok: true, post });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
