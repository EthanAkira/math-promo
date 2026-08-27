import { readBoard, writeBoard, jsonResponse, postImageKey, genId, CORS_HEADERS } from './_shared.js';

const MAX_BYTES = 8 * 1024 * 1024;
const VALID_CATEGORIES = ['notice', 'contact'];

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const posts = await readBoard(env.AMC_FILES);

  const id = url.searchParams.get('id');
  if (id) {
    const post = posts.find((item) => item.id === id);
    if (!post) return jsonResponse({ error: 'Post not found.' }, { status: 404 });
    if (url.searchParams.get('view') === '1') {
      post.views = (post.views || 0) + 1;
      await writeBoard(env.AMC_FILES, posts);
    }
    return jsonResponse({ post });
  }

  const category = url.searchParams.get('category');
  const filtered = VALID_CATEGORIES.includes(category) ? posts.filter((post) => post.category === category) : posts;
  const sorted = [...filtered].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
  return jsonResponse({ posts: sorted });
}

export async function onRequestPost({ request, env }) {
  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid form data.' }, { status: 400 });
  }

  const category = String(formData.get('category') || '');
  if (!VALID_CATEGORIES.includes(category)) {
    return jsonResponse({ error: 'Invalid category.' }, { status: 400 });
  }

  if (category === 'notice') {
    const password = formData.get('password');
    if (!env.AMC_UPLOAD_PASSWORD || password !== env.AMC_UPLOAD_PASSWORD) {
      return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
    }
  }

  const name = String(formData.get('name') || '').trim().slice(0, 60);
  const message = String(formData.get('message') || '').trim().slice(0, 4000);
  if (!message) {
    return jsonResponse({ error: 'Message is required.' }, { status: 400 });
  }

  const id = genId();
  let image = null;
  const file = formData.get('image');
  if (file && typeof file.arrayBuffer === 'function' && file.size > 0) {
    if (file.size > MAX_BYTES) {
      return jsonResponse({ error: 'Image is too large.' }, { status: 400 });
    }
    const key = postImageKey(id);
    const bytes = await file.arrayBuffer();
    await env.AMC_FILES.put(key, bytes, {
      metadata: { contentType: file.type || 'application/octet-stream', filename: file.name || 'image' },
    });
    image = { key, filename: file.name || 'image' };
  }

  const post = {
    id,
    category,
    name: name || null,
    message,
    image,
    createdAt: new Date().toISOString(),
    reply: null,
    views: 0,
  };

  const posts = await readBoard(env.AMC_FILES);
  posts.push(post);
  await writeBoard(env.AMC_FILES, posts);

  return jsonResponse({ ok: true, post });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
