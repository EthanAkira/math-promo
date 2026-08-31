import { readManifest, writeManifest, jsonResponse, fileKey, CORS_HEADERS } from './_shared.js';
import { upsertArchiveItem, resolveStorageFileType, FILE_TYPE_TO_CONTENT_TYPE, VALID_FILE_TYPES, VALID_ACCESS_TIERS } from '../_archive.js';

const MAX_BYTES = 20 * 1024 * 1024;
const VALID_LEVELS = ['8', '10', '12'];

export async function onRequestPost({ request, env }) {
  if (!env.AMC_UPLOAD_PASSWORD) {
    return jsonResponse({ error: 'Upload is not configured.' }, { status: 500 });
  }

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return jsonResponse({ error: 'Invalid form data.' }, { status: 400 });
  }

  const password = formData.get('password');
  if (password !== env.AMC_UPLOAD_PASSWORD) {
    return jsonResponse({ error: 'Incorrect password.' }, { status: 401 });
  }

  const level = String(formData.get('level') || '');
  const year = String(formData.get('year') || '');
  const variantId = String(formData.get('variantId') || '').trim();
  const variantLabel = String(formData.get('variantLabel') || '').trim();
  const fileType = String(formData.get('fileType') || '');
  const solutionMethod = String(formData.get('solutionMethod') || '').trim() || null;
  const unitTag = String(formData.get('unitTag') || '').trim() || null;
  const accessTier = VALID_ACCESS_TIERS.includes(formData.get('accessTier')) ? formData.get('accessTier') : 'free';
  const sourceItemId = String(formData.get('sourceItemId') || '').trim() || null;
  const file = formData.get('file');

  if (!VALID_LEVELS.includes(level)) return jsonResponse({ error: 'Invalid AMC level.' }, { status: 400 });
  if (!/^\d{4}$/.test(year)) return jsonResponse({ error: 'Invalid year.' }, { status: 400 });
  if (!variantId) return jsonResponse({ error: 'Missing variant.' }, { status: 400 });
  if (!VALID_FILE_TYPES.includes(fileType)) return jsonResponse({ error: 'Invalid file type.' }, { status: 400 });
  if (!file || typeof file.arrayBuffer !== 'function') return jsonResponse({ error: 'Missing file.' }, { status: 400 });
  if (file.size > MAX_BYTES) return jsonResponse({ error: 'File is too large (limit 20MB).' }, { status: 400 });

  const slotType = resolveStorageFileType(fileType, solutionMethod);
  const key = fileKey(level, year, variantId, slotType);
  const bytes = await file.arrayBuffer();
  await env.AMC_FILES.put(key, bytes, {
    metadata: { contentType: file.type || 'application/octet-stream', filename: file.name || `${slotType}.pdf` },
  });

  const manifest = await readManifest(env.AMC_FILES);
  const levelYears = manifest[level];
  let yearEntry = levelYears.find((entry) => entry.year === Number(year));
  if (!yearEntry) {
    yearEntry = { year: Number(year), variants: [] };
    levelYears.push(yearEntry);
  }
  let variant = yearEntry.variants.find((item) => item.id === variantId);
  if (!variant) {
    variant = { id: variantId, label: variantLabel || variantId, files: {} };
    yearEntry.variants.push(variant);
  } else if (variantLabel) {
    variant.label = variantLabel;
  }
  variant.files[slotType] = { key, label: file.name || slotType, filename: file.name || `${slotType}.pdf` };

  await writeManifest(env.AMC_FILES, manifest);

  await upsertArchiveItem(env.DB, {
    subject: 'amc',
    level,
    year: Number(year),
    variant: variantId,
    contentType: FILE_TYPE_TO_CONTENT_TYPE[fileType],
    solutionMethod,
    unitTag,
    sourceItemId,
    accessTier,
    title: variantLabel || variantId,
    fileKey: key,
    filename: file.name || `${slotType}.pdf`,
  });

  return jsonResponse({ ok: true, key });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
