import { readManifest, writeManifest, jsonResponse, fileKey, CORS_HEADERS } from './_shared.js';
import { deleteArchiveItemByFileKey } from '../_archive.js';

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { password, level, year, variantId, fileType } = body || {};
  if (password !== env.AMC_UPLOAD_PASSWORD) {
    return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
  }

  const manifest = await readManifest(env.AMC_FILES);
  const levelYears = manifest[String(level)];
  if (!levelYears) return jsonResponse({ error: 'Invalid level.' }, { status: 400 });

  const yearEntry = levelYears.find((entry) => entry.year === Number(year));
  const variant = yearEntry && yearEntry.variants.find((item) => item.id === variantId);
  if (!variant || !variant.files[fileType]) return jsonResponse({ error: 'File not found.' }, { status: 404 });

  const key = fileKey(level, year, variantId, fileType);
  await env.AMC_FILES.delete(key);
  await deleteArchiveItemByFileKey(env.DB, key);
  delete variant.files[fileType];

  if (Object.keys(variant.files).length === 0) {
    yearEntry.variants = yearEntry.variants.filter((item) => item.id !== variantId);
  }
  if (yearEntry.variants.length === 0) {
    manifest[String(level)] = levelYears.filter((entry) => entry.year !== Number(year));
  }

  await writeManifest(env.AMC_FILES, manifest);
  return jsonResponse({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
