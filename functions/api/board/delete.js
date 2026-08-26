import { readBoard, writeBoard, jsonResponse, CORS_HEADERS } from './_shared.js';

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { password, id } = body || {};
  if (!env.AMC_UPLOAD_PASSWORD || password !== env.AMC_UPLOAD_PASSWORD) {
    return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
  }

  const posts = await readBoard(env.AMC_FILES);
  const post = posts.find((item) => item.id === id);
  if (!post) return jsonResponse({ error: 'Post not found.' }, { status: 404 });

  if (post.image?.key) {
    await env.AMC_FILES.delete(post.image.key);
  }

  const remaining = posts.filter((item) => item.id !== id);
  await writeBoard(env.AMC_FILES, remaining);

  return jsonResponse({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
