import { readBoard, writeBoard, jsonResponse, CORS_HEADERS, isAdminPassword } from './_shared.js';

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { password, id, reply } = body || {};
  if (!isAdminPassword(env, password)) {
    return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
  }

  const message = String(reply || '').trim().slice(0, 4000);
  if (!message) return jsonResponse({ error: 'Reply message is required.' }, { status: 400 });

  const posts = await readBoard(env.AMC_FILES);
  const post = posts.find((item) => item.id === id);
  if (!post) return jsonResponse({ error: 'Post not found.' }, { status: 404 });

  post.reply = { message, createdAt: new Date().toISOString() };
  await writeBoard(env.AMC_FILES, posts);

  return jsonResponse({ ok: true, post });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
