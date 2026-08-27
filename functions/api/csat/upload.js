import { readManifest, writeManifest, jsonResponse, fileKey, CORS_HEADERS } from './_shared.js';

const MAX_BYTES = 20 * 1024 * 1024;
const VALID_EXAM_TYPES = ['june', 'sept', 'nov'];
const VALID_FILE_TYPES = ['problems', 'solutions', 'answers'];

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

  const examType = String(formData.get('examType') || '');
  const year = String(formData.get('year') || '');
  const variantId = String(formData.get('variantId') || '').trim();
  const variantLabel = String(formData.get('variantLabel') || '').trim();
  const fileType = String(formData.get('fileType') || '');
  const file = formData.get('file');

  if (!VALID_EXAM_TYPES.includes(examType)) return jsonResponse({ error: 'Invalid exam type.' }, { status: 400 });
  if (!/^\d{4}$/.test(year)) return jsonResponse({ error: 'Invalid year.' }, { status: 400 });
  if (!variantId) return jsonResponse({ error: 'Missing variant.' }, { status: 400 });
  if (!VALID_FILE_TYPES.includes(fileType)) return jsonResponse({ error: 'Invalid file type.' }, { status: 400 });
  if (!file || typeof file.arrayBuffer !== 'function') return jsonResponse({ error: 'Missing file.' }, { status: 400 });
  if (file.size > MAX_BYTES) return jsonResponse({ error: 'File is too large (limit 20MB).' }, { status: 400 });

  const key = fileKey(examType, year, variantId, fileType);
  const bytes = await file.arrayBuffer();
  await env.AMC_FILES.put(key, bytes, {
    metadata: { contentType: file.type || 'application/octet-stream', filename: file.name || `${fileType}.pdf` },
  });

  const manifest = await readManifest(env.AMC_FILES);
  const examYears = manifest[examType];
  let yearEntry = examYears.find((entry) => entry.year === Number(year));
  if (!yearEntry) {
    yearEntry = { year: Number(year), variants: [] };
    examYears.push(yearEntry);
  }
  let variant = yearEntry.variants.find((item) => item.id === variantId);
  if (!variant) {
    variant = { id: variantId, label: variantLabel || variantId, files: {} };
    yearEntry.variants.push(variant);
  } else if (variantLabel) {
    variant.label = variantLabel;
  }
  variant.files[fileType] = { key, label: file.name || fileType, filename: file.name || `${fileType}.pdf` };

  await writeManifest(env.AMC_FILES, manifest);

  return jsonResponse({ ok: true, key });
}

export async function onRequestOptions() {
  return new Response(null, { headers: CORS_HEADERS });
}
