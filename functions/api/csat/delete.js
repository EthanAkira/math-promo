import { readManifest, writeManifest, jsonResponse, fileKey, CORS_HEADERS } from './_shared.js';
import { deleteArchiveItemByFileKey, getArchiveItemByFileKey } from '../_archive.js';

export async function onRequestPost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'Invalid request body.' }, { status: 400 });
  }

  const { password, examType, year, variantId, fileType } = body || {};
  if (password !== env.AMC_UPLOAD_PASSWORD) {
    return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
  }

  const key = fileKey(examType, year, variantId, fileType);

  // The manifest listing (see manifest.js) is now built primarily from D1, which never
  // loses an entry to the KV manifest blob's read-modify-write race. So a file can be
  // visible in the admin list without a matching entry in that blob — look the file up
  // by its deterministic key (D1 row or the raw KV object) rather than requiring the
  // blob to know about it.
  const existingTag = await getArchiveItemByFileKey(env.DB, key);
  const stored = existingTag ? true : await env.AMC_FILES.get(key);
  if (!existingTag && !stored) return jsonResponse({ error: 'File not found.' }, { status: 404 });

  await env.AMC_FILES.delete(key);
  await deleteArchiveItemByFileKey(env.DB, key);

  const manifest = await readManifest(env.AMC_FILES);
  const examYears = manifest[String(examType)];
  const yearEntry = examYears && examYears.find((entry) => entry.year === Number(year));
  const variant = yearEntry && yearEntry.variants.find((item) => item.id === variantId);
  if (variant && variant.files[fileType]) {
    delete variant.files[fileType];
    if (Object.keys(variant.files).length === 0) {
      yearEntry.variants = yearEntry.variants.filter((item) => item.id !== variantId);
    }
    if (yearEntry.variants.length === 0) {
      manifest[String(examType)] = examYears.filter((entry) => entry.year !== Number(year));
    }
    await writeManifest(env.AMC_FILES, manifest);
  }

  return jsonResponse({ ok: true });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
