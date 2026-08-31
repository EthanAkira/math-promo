import { readBoard, writeBoard, jsonResponse, CORS_HEADERS, isAdminPassword, orderOf } from './_shared.js';

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { password, id, direction } = body || {};
  if (!isAdminPassword(env, password)) {
    return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
  }
  if (direction !== 'up' && direction !== 'down') {
    return jsonResponse({ error: 'direction must be "up" or "down".' }, { status: 400 });
  }

  const posts = await readBoard(env.AMC_FILES);
  const target = posts.find((item) => item.id === id);
  if (!target) return jsonResponse({ error: 'Post not found.' }, { status: 404 });

  // Same ordering as the list view: same category, sorted highest-order first.
  const siblings = posts.filter((item) => item.category === target.category).sort((a, b) => orderOf(b) - orderOf(a));
  const index = siblings.findIndex((item) => item.id === id);
  const swapIndex = direction === 'up' ? index - 1 : index + 1;
  if (swapIndex < 0 || swapIndex >= siblings.length) {
    return jsonResponse({ error: 'Already at the edge of the list.' }, { status: 400 });
  }

  const neighbor = siblings[swapIndex];
  const targetOrder = orderOf(target);
  const neighborOrder = orderOf(neighbor);
  target.order = neighborOrder;
  neighbor.order = targetOrder;

  await writeBoard(env.AMC_FILES, posts);

  return jsonResponse({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
